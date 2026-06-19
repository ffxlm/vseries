import fs from 'node:fs';

function loadEnvFile(path) {
  if (!fs.existsSync(path)) return;

  const lines = fs.readFileSync(path, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile('.env.local');

const errors = [];

const requireValue = (name) => {
  if (!process.env[name]?.trim()) {
    errors.push(`${name} is required`);
  }
};

const isHttpUrl = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

requireValue('NEXT_PUBLIC_API_URL');
requireValue('NEXT_PUBLIC_SITE_URL');
requireValue('JWT_SECRET');

if (process.env.NEXT_PUBLIC_API_URL && !isHttpUrl(process.env.NEXT_PUBLIC_API_URL)) {
  errors.push('NEXT_PUBLIC_API_URL must be a valid http(s) URL');
}

if (process.env.NEXT_PUBLIC_SITE_URL && !isHttpUrl(process.env.NEXT_PUBLIC_SITE_URL)) {
  errors.push('NEXT_PUBLIC_SITE_URL must be a valid http(s) URL');
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  errors.push('JWT_SECRET must be at least 32 characters and match the backend JWT_SECRET');
}

console.log('Frontend env check');
console.log({
  hasApiUrl: Boolean(process.env.NEXT_PUBLIC_API_URL),
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
  hasJwtSecret: Boolean(process.env.JWT_SECRET),
  jwtSecretLength: process.env.JWT_SECRET?.length || 0,
});

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`FAIL ${error}`);
  }
  process.exit(1);
}

console.log('PASS Frontend env is ready');
