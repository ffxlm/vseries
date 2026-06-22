import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';
import Series from '../models/Series.js';
import Episode from '../models/Episode.js';
import mongoose from 'mongoose';

// Fallback API Key in case it's not set in .env
const API_KEY = process.env.SERIESJEEN_API_KEY || 'seriesjeen_54dd5ff653dc3a098d87a1d23012ab6e96562890f8f69776';
const BASE_URL = 'https://api.seriesjeen.online/api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper for making API calls with Native Fetch and timeout
async function apiCall(endpoint) {
  const url = `${BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      },
      signal: controller.signal
    });

    if (!response.ok) {
      if (response.status === 503) {
        throw new Error('API is currently undergoing maintenance (503).');
      }
      throw new Error(`API call failed with status ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`Error fetching from API [${url}]: Request timed out (15s)`);
      throw new Error('API call timed out (15s)');
    }
    console.error(`Error fetching from API [${url}]:`, error.message);
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

// Generate ID-based slug for clean URLs
async function generateSlug(title, apiSeriesId) {
  if (apiSeriesId) {
    // Some IDs might be long ObjectIds, we can use the last 8-10 chars, or the whole thing if it's short.
    // Let's use the whole API ID for consistency to avoid duplicates.
    return apiSeriesId.toString().toLowerCase();
  }

  // Fallback if no ID is provided (shouldn't happen)
  return `s-${Math.floor(Math.random() * 1000000)}`;
}

// Sync episodes for a specific series
async function syncEpisodes(seriesDocument, apiSeriesId, updateOnly = false) {
  try {
    console.log(`\n--- Fetching episodes for: "${seriesDocument.title}" (${apiSeriesId}) ---`);
    const episodesData = await apiCall(`/platform/reelshort/allepisodes/${apiSeriesId}`);

    if (!episodesData || !episodesData.episodes || !Array.isArray(episodesData.episodes)) {
      console.warn(`No episodes found or invalid data for series ID: ${apiSeriesId}`);
      return;
    }

    const items = episodesData.episodes;
    console.log(`Found ${items.length} episodes on source.`);

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of items) {
      const episodeNum = Number(item.episode);
      if (isNaN(episodeNum)) continue;

      // Find the best quality stream URL
      // The API often returns HEVC streams first, followed by H.264 streams.
      // We pick the last '720p' stream to maximize browser compatibility (H.264).
      let bestStream = null;
      if (item.streams && Array.isArray(item.streams)) {
        const streams720 = item.streams.filter(s => s.quality === '720p');
        bestStream = streams720[streams720.length - 1] || item.streams[item.streams.length - 1];
      }

      if (!bestStream || !bestStream.url) {
        console.warn(`No valid stream URL found for Episode ${episodeNum}`);
        continue;
      }

      const streamUrl = bestStream.url;
      const cleanTitle = `EP${episodeNum}`;

      // Check if episode already exists in DB
      const existingEpisode = await Episode.findOne({
        seriesId: seriesDocument._id,
        episodeNumber: episodeNum
      });

      if (existingEpisode) {
        // Update URL if changed
        if (existingEpisode.videoUrl !== streamUrl) {
          existingEpisode.videoUrl = streamUrl;
          await existingEpisode.save();
          updatedCount++;
        }
      } else if (!updateOnly) {
        // Create new episode
        await Episode.create({
          seriesId: seriesDocument._id,
          episodeNumber: episodeNum,
          title: cleanTitle,
          videoUrl: streamUrl
        });
        createdCount++;
      }
    }

    console.log(`Finished episodes sync for "${seriesDocument.title}": Created ${createdCount}, Updated ${updatedCount} links.`);
    
    // Update total episodes count in the Series model
    const actualTotalEpisodes = await Episode.countDocuments({ seriesId: seriesDocument._id });
    if (seriesDocument.totalEpisodes !== actualTotalEpisodes) {
      seriesDocument.totalEpisodes = actualTotalEpisodes;
      await seriesDocument.save();
    }
  } catch (error) {
    console.error(`Failed to sync episodes for series ID ${apiSeriesId}:`, error.message);
  }
}

// Main logic
async function main() {
  // Parse command line arguments
  const args = process.argv.slice(2);
  const isAll = args.includes('--all');
  const isUpdate = args.includes('--update');
  const seriesIdArg = args.find((_, i) => args[i - 1] === '--id');
  const limitArgIndex = args.indexOf('--limit');
  const limit = limitArgIndex !== -1 ? Number(args[limitArgIndex + 1]) : null;

  if (!isAll && !isUpdate && !seriesIdArg) {
    console.log(`
VSeries-Project Sync Tool
=========================
Usage:
  node scripts/sync.js --all                  - Sync all 400 series from API (adds new series and all episodes)
  node scripts/sync.js --all --limit <num>    - Sync only a limited number of series (e.g. 10 series)
  node scripts/sync.js --id <id>              - Sync a specific series by Series ID
  node scripts/sync.js --update               - Update video links for all series currently in your database
`);
    process.exit(0);
  }

  // Connect to DB
  console.log('Connecting to database...');
  await connectDB();

  try {
    if (isUpdate) {
      console.log('\n=================================================');
      console.log('MODE: Refresh / Update URLs for existing series');
      console.log('=================================================\n');

      const localSeries = await Series.find();
      console.log(`Found ${localSeries.length} series in local database to update.`);

      for (let i = 0; i < localSeries.length; i++) {
        const series = localSeries[i];
        
        // Since we mapped the API's series_id, we need to know what it was.
        // We check if it is already stored, otherwise search the API.
        let apiSeriesId = series.apiSeriesId || null;

        if (!apiSeriesId) {
          console.log(`[${i + 1}/${localSeries.length}] Locating source series_id for: "${series.title}" (Fallback search)...`);
          // Search API pages for the series
          findLoop: for (let page = 1; page <= 20; page++) {
            const list = await apiCall(`/platform/reelshort/thai?page=${page}`);
            if (list && list.items) {
              const match = list.items.find(item => item.title === series.title || item.cover === series.posterUrl);
              if (match) {
                apiSeriesId = match.series_id;
                // Cache it for future updates
                series.apiSeriesId = apiSeriesId;
                await series.save();
                break findLoop;
              }
            }
            await delay(200);
          }
        } else {
          console.log(`[${i + 1}/${localSeries.length}] Using cached series_id for: "${series.title}" (${apiSeriesId})`);
        }

        if (apiSeriesId) {
          await syncEpisodes(series, apiSeriesId, true);
        } else {
          console.warn(`Could not locate matching Series ID on source API for "${series.title}". Skipping.`);
        }
        await delay(500); // Friendly rate limit delay
      }

    } else if (seriesIdArg) {
      console.log(`\nMODE: Sync single series by ID: ${seriesIdArg}\n`);

      // We need to fetch details for this series.
      // Since there is no direct details endpoint, we find it in the platform list.
      let apiSeriesItem = null;
      console.log('Searching list for matching Series ID...');
      
      findLoop: for (let page = 1; page <= 20; page++) {
        const list = await apiCall(`/platform/reelshort/thai?page=${page}`);
        if (list && list.items) {
          const match = list.items.find(item => item.series_id === seriesIdArg);
          if (match) {
            apiSeriesItem = match;
            break findLoop;
          }
        }
        await delay(100);
      }

      if (!apiSeriesItem) {
        console.error(`Could not find series with ID: ${seriesIdArg} on the API.`);
        process.exit(1);
      }

      // Check if already exists in local DB
      let series = await Series.findOne({ title: apiSeriesItem.title });
      if (!series) {
        const slug = await generateSlug(apiSeriesItem.title, apiSeriesItem.series_id);
        const languageType = (apiSeriesItem.title.includes('พากย์') || apiSeriesItem.title.includes('พากษ์') || apiSeriesItem.title.includes('พากย์ไทย')) 
          ? 'thai_dub' 
          : 'thai_sub';

        const cleanTitle = apiSeriesItem.title.replace(/^\(พากย์\)\s*|^\(พากษ์\)\s*|^\(ซับไทย\)\s*/gi, '').trim();
        series = await Series.create({
          title: cleanTitle,
          slug,
          description: apiSeriesItem.description || 'ไม่มีเรื่องย่อ',
          posterUrl: apiSeriesItem.cover,
          languageType,
          totalEpisodes: apiSeriesItem.episode_count || 0,
          apiSeriesId: seriesIdArg
        });
        console.log(`Created new series in database: "${series.title}" with slug: "${series.slug}"`);
      } else {
        console.log(`Series "${series.title}" already exists in local database.`);
        if (!series.apiSeriesId) {
          series.apiSeriesId = seriesIdArg;
          await series.save();
        }
      }

      await syncEpisodes(series, seriesIdArg, false);

    } else if (isAll) {
      console.log('\n=================================================');
      console.log('MODE: Sync all available series from API');
      console.log('=================================================\n');

      let syncedCount = 0;
      mainLoop: for (let page = 1; page <= 20; page++) {
        console.log(`\n--- Fetching Platform List Page ${page}/20 ---`);
        const list = await apiCall(`/platform/reelshort/thai?page=${page}`);

        if (!list || !list.items || list.items.length === 0) {
          console.log('No more items found on this page. Stopping.');
          break;
        }

        const items = list.items;
        console.log(`Page ${page} contains ${items.length} series.`);

        for (const item of items) {
          if (limit && syncedCount >= limit) {
            console.log(`\nReached sync limit of ${limit} series. Stopping.`);
            break mainLoop;
          }

          // Check if already exists in DB
          let series = await Series.findOne({ title: item.title });
          
          if (!series) {
            const slug = await generateSlug(item.title, item.series_id);
            const languageType = (item.title.includes('พากย์') || item.title.includes('พากษ์') || item.title.includes('พากย์ไทย')) 
              ? 'thai_dub' 
              : 'thai_sub';

            const cleanTitle = item.title.replace(/^\(พากย์\)\s*|^\(พากษ์\)\s*|^\(ซับไทย\)\s*/gi, '').trim();
            series = await Series.create({
              title: cleanTitle,
              slug,
              description: item.description || 'ไม่มีเรื่องย่อ',
              posterUrl: item.cover,
              languageType,
              totalEpisodes: item.episode_count || 0,
              apiSeriesId: item.series_id
            });
            console.log(`Created Series: "${series.title}" (slug: ${series.slug})`);
          } else {
            console.log(`Series already exists: "${series.title}". Skipping creation.`);
            if (!series.apiSeriesId) {
              series.apiSeriesId = item.series_id;
              await series.save();
            }
          }

          // Sync episodes for this series
          await syncEpisodes(series, item.series_id, false);
          
          syncedCount++;

          // Friendly delay to avoid hitting rate limits
          await delay(800);
        }
      }
    }

    console.log('\nSync operation completed successfully!');
  } catch (error) {
    console.error('\nSync failed with error:', error.message);
  } finally {
    mongoose.connection.close();
    console.log('Database connection closed.');
  }
}

main();
