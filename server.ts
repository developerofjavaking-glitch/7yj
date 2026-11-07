import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { buildManager } from './server/buildManager.js';
import { DEMO_PROJECTS } from './server/demoProjects.js';

dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

// Set up Multer for zip file uploads
const uploadDir = '/tmp/cloudapk-uploads';
fs.mkdirSync(uploadDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max
  },
  fileFilter: (_req, file, cb) => {
    const isZip =
      file.mimetype === 'application/zip' ||
      file.mimetype === 'application/x-zip-compressed' ||
      file.originalname.toLowerCase().endsWith('.zip');
    if (isZip) {
      cb(null, true);
    } else {
      cb(new Error('Only .zip files containing Android Studio source code are allowed.'));
    }
  },
});

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'CloudAPK Studio' });
});

// List demo projects
app.get('/api/demos', (_req, res) => {
  const demos = Object.values(DEMO_PROJECTS).map((d) => ({
    id: d.id,
    name: d.name,
    description: d.description,
    packageName: d.packageName,
    versionName: d.versionName,
    hasIntentionalError: !!d.hasIntentionalError,
  }));
  res.json(demos);
});

// Upload ZIP file & start build
app.post('/api/build/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please upload a valid .zip file.' });
    }
    const buildId = await buildManager.startBuildFromZip(req.file.buffer, req.file.originalname);
    res.json({ success: true, buildId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to process project archive.' });
  }
});

// Start build from demo project
app.post('/api/build/demo', async (req, res) => {
  try {
    const demoId = req.body?.demoId || 'mazebd';
    const buildId = await buildManager.startDemoBuild(demoId);
    res.json({ success: true, buildId });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to start demo build.' });
  }
});

// List all builds
app.get('/api/builds', (_req, res) => {
  res.json(buildManager.getAllBuilds());
});

// Get single build status
app.get('/api/build/:id', (req, res) => {
  const build = buildManager.getBuild(req.params.id);
  if (!build) {
    return res.status(404).json({ error: 'Build not found.' });
  }
  res.json(build);
});

// Server-Sent Events (SSE) for real-time progress & logs
app.get('/api/build/:id/events', (req, res) => {
  const buildId = req.params.id;
  const build = buildManager.getBuild(buildId);
  if (!build) {
    return res.status(404).send('Build not found');
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // Send current state immediately
  res.write(
    `data: ${JSON.stringify({
      type: 'initial',
      build,
    })}\n\n`
  );

  // Subscribe to live events
  const unsubscribe = buildManager.subscribe(buildId, (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  });

  req.on('close', () => {
    unsubscribe();
  });
});

// Direct APK Download
app.get('/api/build/:id/download-apk', (req, res) => {
  const build = buildManager.getBuild(req.params.id);
  if (!build || build.status !== 'COMPLETED' || !build.apkInfo) {
    return res.status(404).send('APK artifact is not ready or build failed.');
  }

  const apkPath = buildManager.getApkPath(req.params.id);
  if (!apkPath || !fs.existsSync(apkPath)) {
    return res.status(404).send('APK file not found on disk.');
  }

  const filename = build.apkInfo.fileName || 'app-debug.apk';
  res.setHeader('Content-Type', 'application/vnd.android.package-archive');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  const fileStream = fs.createReadStream(apkPath);
  fileStream.pipe(res);
});

// Direct Log File Download (.txt)
app.get('/api/build/:id/download-log', (req, res) => {
  const build = buildManager.getBuild(req.params.id);
  if (!build) {
    return res.status(404).send('Build not found.');
  }

  const logContent = buildManager.getLogText(req.params.id);
  const logFilename = `build-log-${build.projectName}-${build.id}.txt`;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${logFilename}"`);
  res.send(logContent);
});

// AI Error Diagnosis & Autofix Suggestion
app.post('/api/build/:id/ai-diagnose', async (req, res) => {
  try {
    const diagnosis = await buildManager.diagnoseWithAi(req.params.id);
    res.json({ success: true, diagnosis });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'AI diagnosis failed' });
  }
});

// Mount Vite middleware for dev or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve('dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`CloudAPK Studio server listening at http://0.0.0.0:${port}`);
  });
}

startServer();
