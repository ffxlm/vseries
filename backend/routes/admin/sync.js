import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { protectAdmin } from '../../middleware/auth.js';

const router = express.Router();

// Global variable to store sync progress
global.syncProgress = {
  isRunning: false,
  mode: '',
  current: 0,
  total: 0,
  message: '',
  error: null,
};

let activeSyncProcess = null;

router.post('/sync/start', protectAdmin, (req, res) => {
  if (global.syncProgress.isRunning) {
    return res.status(400).json({ success: false, message: 'Sync is already running' });
  }

  const { mode } = req.body; // 'all' or 'update'
  if (mode !== 'all' && mode !== 'update') {
    return res.status(400).json({ success: false, message: 'Invalid mode' });
  }

  // Reset progress
  global.syncProgress = {
    isRunning: true,
    mode,
    current: 0,
    total: 0,
    message: 'กำลังเตรียมการ...',
    error: null,
  };

  const scriptPath = path.resolve('scripts/sync.js');
  const args = mode === 'all' ? ['--all'] : ['--update'];
  
  const child = spawn('node', [scriptPath, ...args]);
  activeSyncProcess = child;

  child.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(`[SYNC STDOUT] ${output.trim()}`);
    
    // Parse progress from output like "[15/400] Locating source..."
    const progressMatch = output.match(/\[(\d+)\/(\d+)\]/);
    if (progressMatch) {
      global.syncProgress.current = parseInt(progressMatch[1], 10);
      global.syncProgress.total = parseInt(progressMatch[2], 10);
    }
    
    global.syncProgress.message = output.split('\n')[0].trim();
  });

  child.stderr.on('data', (data) => {
    console.error(`[SYNC STDERR] ${data.toString().trim()}`);
  });

  child.on('close', (code) => {
    global.syncProgress.isRunning = false;
    activeSyncProcess = null;
    
    if (code === null || code === 143) { // 143 is SIGTERM
      global.syncProgress.error = 'ถูกยกเลิกการทำงาน';
      global.syncProgress.message = 'หยุดการดึงข้อมูลแล้ว';
    } else if (code !== 0) {
      global.syncProgress.error = `Process exited with code ${code}`;
      global.syncProgress.message = 'เกิดข้อผิดพลาดในการดึงข้อมูล';
    } else {
      global.syncProgress.message = 'อัพเดตข้อมูลเสร็จสมบูรณ์';
      if (global.syncProgress.total > 0) {
        global.syncProgress.current = global.syncProgress.total;
      }
    }
  });

  res.json({ success: true, message: 'Sync started' });
});

router.post('/sync/stop', protectAdmin, (req, res) => {
  if (!global.syncProgress.isRunning || !activeSyncProcess) {
    return res.status(400).json({ success: false, message: 'No sync process is currently running' });
  }

  try {
    activeSyncProcess.kill('SIGTERM');
    global.syncProgress.isRunning = false;
    global.syncProgress.message = 'กำลังหยุดการทำงาน...';
    res.json({ success: true, message: 'Sync stop signal sent' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to stop process' });
  }
});

router.get('/sync/status', protectAdmin, (req, res) => {
  res.json({ success: true, data: global.syncProgress });
});

export default router;
