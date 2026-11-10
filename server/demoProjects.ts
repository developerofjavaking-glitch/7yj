import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

export interface DemoProjectDef {
  id: string;
  name: string;
  description: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  category: 'game' | 'app' | 'starter' | 'test';
  tags: string[];
  hasIntentionalError?: boolean;
  errorMessage?: string;
  files?: { path: string; content: string }[];
}

export const DEMO_PROJECTS: Record<string, DemoProjectDef> = {
  mazebd: {
    id: 'mazebd',
    name: 'MazeBD Creator',
    description: 'Complete Android Studio puzzle game with Kotlin DSL, custom layouts, audio sound effects, and interactive levels.',
    packageName: 'com.mazebd.creator',
    versionName: '1.0.0',
    versionCode: 1,
    category: 'game',
    tags: ['Kotlin', 'Jetpack', 'Game Engine', 'Gradle 8.5'],
  },
  game_launcher: {
    id: 'game_launcher',
    name: 'Jairo Game Launcher Hub',
    description: 'Production Android TV and Mobile game hub with vector icons, media services, foreground services, and Material design.',
    packageName: 'com.android.gamelauncher',
    versionName: '2.1.0',
    versionCode: 21,
    category: 'app',
    tags: ['Android TV', 'Foreground Service', 'Material UI', 'Full Assets'],
  },
  compose_starter: {
    id: 'compose_starter',
    name: 'Jetpack Material 3 Starter',
    description: 'Lightweight modern Android application template with Android 14 target, Material 3 theming, and edge-to-edge UI.',
    packageName: 'com.cloudapk.materialstarter',
    versionName: '1.0.0',
    versionCode: 1,
    category: 'starter',
    tags: ['Material 3', 'Android 14', 'Edge-to-Edge'],
    files: [
      {
        path: 'app/src/main/AndroidManifest.xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.cloudapk.materialstarter">
    <uses-permission android:name="android.permission.INTERNET" />
    <application
        android:allowBackup="true"
        android:label="Material 3 Starter"
        android:theme="@style/Theme.Material3.DayNight.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
      },
      {
        path: 'app/src/main/java/com/cloudapk/materialstarter/MainActivity.java',
        content: `package com.cloudapk.materialstarter;
import android.app.Activity;
import android.os.Bundle;

public class MainActivity extends Activity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
}`,
      },
      {
        path: 'app/src/main/res/layout/activity_main.xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center"
    android:orientation="vertical"
    android:background="#0F172A"
    android:padding="24dp">
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome to CloudAPK Studio"
        android:textColor="#10B981"
        android:textSize="24sp"
        android:textStyle="bold" />
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:text="Built and compiled in real time with OpenJDK and D8"
        android:textColor="#94A3B8"
        android:textSize="14sp" />
</LinearLayout>`,
      },
      {
        path: 'app/src/main/res/values/strings.xml',
        content: `<resources>
    <string name="app_name">Material 3 Starter</string>
</resources>`,
      },
    ],
  },
  error_demo: {
    id: 'error_demo',
    name: 'Syntax Error Diagnostic Test',
    description: 'Android project containing deliberate Kotlin syntax errors to test the compiler error parser and Gemini AI Diagnosis.',
    packageName: 'com.example.brokenapp',
    versionName: '1.0.0-beta',
    versionCode: 1,
    category: 'test',
    tags: ['Diagnostics', 'AI Debugging', 'Syntax Parsing'],
    hasIntentionalError: true,
    errorMessage: `e: /tmp/cloudapk-builds/build-error-test/app/src/main/java/com/example/brokenapp/MainActivity.kt: (18, 24): Unresolved reference: NonExistentHelperClass
e: /tmp/cloudapk-builds/build-error-test/app/src/main/java/com/example/brokenapp/MainActivity.kt: (19, 21): Expecting ')' before end of block
> Task :app:compileDebugKotlin FAILED`,
    files: [
      {
        path: 'app/src/main/AndroidManifest.xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.brokenapp">
    <application
        android:label="Broken App"
        android:theme="@style/Theme.AppCompat.Light">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`,
      },
      {
        path: 'app/src/main/java/com/example/brokenapp/MainActivity.kt',
        content: `package com.example.brokenapp

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Intentional compilation syntax errors:
        val helper = NonExistentHelperClass()
        helper.doSomething(
    }
}`,
      },
    ],
  },
};

export function createDemoZip(demoId: string): Buffer {
  if (demoId === 'mazebd') {
    const realZipPath = path.resolve('public/assets/aistudio/MazeBDCreator_7210c0a4.zip');
    if (fs.existsSync(realZipPath)) {
      return fs.readFileSync(realZipPath);
    }
  } else if (demoId === 'game_launcher') {
    const realZipPath = path.resolve('public/assets/aistudio/Game-Launcher-main_474fcc1f.zip');
    if (fs.existsSync(realZipPath)) {
      return fs.readFileSync(realZipPath);
    }
  }

  const demo = DEMO_PROJECTS[demoId] || DEMO_PROJECTS.mazebd;
  const zip = new AdmZip();
  if (demo.files) {
    for (const f of demo.files) {
      zip.addFile(f.path, Buffer.from(f.content, 'utf-8'));
    }
  }
  return zip.toBuffer();
}
