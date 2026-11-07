import AdmZip from 'adm-zip';

export interface DemoProjectDef {
  id: string;
  name: string;
  description: string;
  packageName: string;
  versionName: string;
  versionCode: number;
  hasIntentionalError?: boolean;
  errorMessage?: string;
  files: { path: string; content: string }[];
}

export const DEMO_PROJECTS: Record<string, DemoProjectDef> = {
  mazebd: {
    id: 'mazebd',
    name: 'MazeBDCreator',
    description: 'Android Studio Kotlin DSL project (as shown in ZArchiver screenshot)',
    packageName: 'com.mazebd.creator',
    versionName: '1.0.0',
    versionCode: 1,
    files: [
      {
        path: 'build.gradle.kts',
        content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`,
      },
      {
        path: 'settings.gradle.kts',
        content: `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "MazeBDCreator"
include(":app")
`,
      },
      {
        path: 'gradle.properties',
        content: `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`,
      },
      {
        path: 'gradlew',
        content: `#!/bin/sh
exec java -version
`,
      },
      {
        path: 'README.md',
        content: `# MazeBDCreator
An Android application for creating and solving maze puzzles.
Built with Android Studio, Kotlin, and Jetpack.
`,
      },
      {
        path: 'app/build.gradle.kts',
        content: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
}

android {
    namespace = "com.mazebd.creator"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.mazebd.creator"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = "1.8"
    }
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
}
`,
      },
      {
        path: 'app/src/main/AndroidManifest.xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="com.mazebd.creator">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="MazeBD Creator"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.MazeBDCreator">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`,
      },
      {
        path: 'app/src/main/java/com/mazebd/creator/MainActivity.kt',
        content: `package com.mazebd.creator

import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {
    private var mazeLevel = 1

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val titleView = findViewById<TextView>(R.id.titleView)
        val levelButton = findViewById<Button>(R.id.btnNextLevel)

        titleView.text = "MazeBD Creator - Level $mazeLevel"
        levelButton.setOnClickListener {
            mazeLevel++
            titleView.text = "MazeBD Creator - Level $mazeLevel"
            Toast.makeText(this, "Generating Maze Level $mazeLevel...", Toast.LENGTH_SHORT).show()
        }
    }
}
`,
      },
      {
        path: 'app/src/main/res/values/strings.xml',
        content: `<resources>
    <string name="app_name">MazeBD Creator</string>
    <string name="next_level">Generate Next Maze</string>
</resources>
`,
      },
      {
        path: 'app/src/main/res/layout/activity_main.xml',
        content: `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:gravity="center"
    android:padding="24dp"
    android:background="#0F172A">

    <TextView
        android:id="@+id/titleView"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="MazeBD Creator"
        android:textColor="#FFFFFF"
        android:textSize="22sp"
        android:textStyle="bold"
        android:layout_marginBottom="20dp" />

    <Button
        android:id="@+id/btnNextLevel"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="@string/next_level"
        android:backgroundTint="#10B981"
        android:textColor="#FFFFFF" />
</LinearLayout>
`,
      },
    ],
  },
  error_demo: {
    id: 'error_demo',
    name: 'BrokenAppProject',
    description: 'Android project with deliberate Kotlin syntax error & missing bracket to test error logging & AI diagnostics',
    packageName: 'com.example.brokenapp',
    versionName: '1.0.0-beta',
    versionCode: 1,
    hasIntentionalError: true,
    errorMessage: `e: /tmp/cloudapk-builds/build-error-test/app/src/main/java/com/example/brokenapp/MainActivity.kt: (18, 24): Unresolved reference: NonExistentHelperClass
e: /tmp/cloudapk-builds/build-error-test/app/src/main/java/com/example/brokenapp/MainActivity.kt: (22, 9): Expecting ')' before 'Toast'
> Task :app:compileDebugKotlin FAILED`,
    files: [
      {
        path: 'build.gradle.kts',
        content: `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
}
`,
      },
      {
        path: 'settings.gradle.kts',
        content: `rootProject.name = "BrokenAppProject"
include(":app")
`,
      },
      {
        path: 'app/build.gradle.kts',
        content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.example.brokenapp"
    compileSdk = 34
    defaultConfig {
        applicationId = "com.example.brokenapp"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0-beta"
    }
}
`,
      },
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
</manifest>
`,
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
}
`,
      },
    ],
  },
};

export function createDemoZip(demoId: string): Buffer {
  const demo = DEMO_PROJECTS[demoId] || DEMO_PROJECTS.mazebd;
  const zip = new AdmZip();
  for (const f of demo.files) {
    zip.addFile(f.path, Buffer.from(f.content, 'utf-8'));
  }
  return zip.toBuffer();
}
