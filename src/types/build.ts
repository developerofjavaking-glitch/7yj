export interface LogEntry {
  id: number;
  timestamp: string;
  text: string;
  type: 'info' | 'task' | 'success' | 'warn' | 'error';
}

export interface BuildError {
  file: string;
  line: number;
  message: string;
  snippet?: string;
}

export interface ApkMetadata {
  fileName: string;
  size: number;
  sha256: string;
  downloadUrl: string;
  logUrl: string;
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  permissions: string[];
}

export interface BuildState {
  id: string;
  projectName: string;
  packageName: string;
  appName: string;
  versionName: string;
  versionCode: number;
  minSdk: number;
  targetSdk: number;
  status: 'QUEUED' | 'ANALYZING' | 'BUILDING' | 'COMPLETED' | 'FAILED';
  progress: number;
  currentTask: string;
  stageName: string;
  logs: LogEntry[];
  errors: BuildError[];
  apkInfo?: ApkMetadata;
  fileTree: string[];
  createdAt: string;
  completedAt?: string;
  durationMs?: number;
  aiDiagnosis?: {
    summary: string;
    cause: string;
    solution: string;
    codeFix?: string;
  };
}

export interface DemoProject {
  id: string;
  name: string;
  description: string;
  packageName: string;
  versionName: string;
  category?: 'game' | 'app' | 'starter' | 'test';
  tags?: string[];
  hasIntentionalError: boolean;
}
