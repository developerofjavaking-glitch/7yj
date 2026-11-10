import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';
import AdmZip from 'adm-zip';

export const SDK_DIR = '/opt/android-sdk';
export const ANDROID_JAR = path.join(SDK_DIR, 'android.jar');
export const R8_JAR = path.join(SDK_DIR, 'r8.jar');
export const ANDROIDX_STUBS_JAR = path.join(SDK_DIR, 'androidx-stubs.jar');
export const COMPAT_RES_DIR = path.join(SDK_DIR, 'compat-res');
export const DEBUG_KEYSTORE = path.join(SDK_DIR, 'debug.keystore');

/**
 * Ensures all required Android compilation and packaging tools are available on the system.
 */
export async function ensureToolchainReady(): Promise<boolean> {
  console.log('[Toolchain] Verifying Android toolchain components...');
  try {
    fs.mkdirSync(SDK_DIR, { recursive: true });

    // 1. Android Framework JAR (API 34)
    if (!fs.existsSync(ANDROID_JAR) || fs.statSync(ANDROID_JAR).size < 1024 * 1024) {
      console.log('[Toolchain] Downloading Android API 34 android.jar...');
      try {
        execSync(
          `curl -s -L "https://raw.githubusercontent.com/Sable/android-platforms/master/android-34/android.jar" -o ${ANDROID_JAR}`,
          { stdio: 'ignore', timeout: 60000 }
        );
      } catch (err: any) {
        console.warn('[Toolchain] Primary android.jar download failed, trying mirror...', err.message);
        execSync(
          `curl -s -L "https://repo1.maven.org/maven2/com/google/android/android/4.1.1.4/android-4.1.1.4.jar" -o ${ANDROID_JAR}`,
          { stdio: 'ignore', timeout: 60000 }
        );
      }
    }

    // 2. R8/D8 Dexer JAR
    if (!fs.existsSync(R8_JAR) || fs.statSync(R8_JAR).size < 1024 * 1024) {
      console.log('[Toolchain] Downloading Android D8 / R8 compiler engine...');
      execSync(
        `curl -s -L "https://dl.google.com/dl/android/maven2/com/android/tools/r8/8.2.42/r8-8.2.42.jar" -o ${R8_JAR}`,
        { stdio: 'ignore', timeout: 60000 }
      );
    }

    // 3. AndroidX Stubs JAR
    if (!fs.existsSync(ANDROIDX_STUBS_JAR)) {
      console.log('[Toolchain] Generating AndroidX and Jetpack compatibility stubs...');
      buildAndroidXStubs();
    }

    // 4. AppCompat & Material Overlay Resources
    if (!fs.existsSync(path.join(COMPAT_RES_DIR, 'values', 'compat_attrs.xml'))) {
      console.log('[Toolchain] Creating AppCompat and Material overlay attributes...');
      createCompatOverlay();
    }

    // 5. Android Debug Keystore
    if (!fs.existsSync(DEBUG_KEYSTORE)) {
      console.log('[Toolchain] Creating 2048-bit RSA Android Debug Keystore...');
      try {
        execSync(
          `keytool -genkeypair -v -keystore ${DEBUG_KEYSTORE} -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US" -noprompt`,
          { stdio: 'ignore' }
        );
      } catch (err: any) {
        console.warn('[Toolchain] Keytool warning:', err.message);
      }
    }

    console.log('[Toolchain] Android compilation engine is fully initialized and ready!');
    return true;
  } catch (err: any) {
    console.error('[Toolchain] Toolchain initialization error:', err.message);
    return false;
  }
}

function buildAndroidXStubs() {
  const stubDir = '/tmp/androidx-stubs-build';
  fs.mkdirSync(stubDir + '/src/androidx/appcompat/app', { recursive: true });
  fs.mkdirSync(stubDir + '/src/androidx/fragment/app', { recursive: true });
  fs.mkdirSync(stubDir + '/src/androidx/core/app', { recursive: true });
  fs.mkdirSync(stubDir + '/src/androidx/activity', { recursive: true });
  fs.mkdirSync(stubDir + '/bin', { recursive: true });

  fs.writeFileSync(
    stubDir + '/src/androidx/core/app/ComponentActivity.java',
    `package androidx.core.app;
import android.app.Activity;
public class ComponentActivity extends Activity {}`
  );

  fs.writeFileSync(
    stubDir + '/src/androidx/activity/ComponentActivity.java',
    `package androidx.activity;
public class ComponentActivity extends androidx.core.app.ComponentActivity {}`
  );

  fs.writeFileSync(
    stubDir + '/src/androidx/fragment/app/FragmentActivity.java',
    `package androidx.fragment.app;
public class FragmentActivity extends androidx.activity.ComponentActivity {}`
  );

  fs.writeFileSync(
    stubDir + '/src/androidx/appcompat/app/AppCompatActivity.java',
    `package androidx.appcompat.app;
public class AppCompatActivity extends androidx.fragment.app.FragmentActivity {}`
  );

  try {
    execSync(
      `ecj -proc:none -source 1.8 -target 1.8 -cp ${ANDROID_JAR} -d ${stubDir}/bin ` +
      `${stubDir}/src/androidx/core/app/ComponentActivity.java ` +
      `${stubDir}/src/androidx/activity/ComponentActivity.java ` +
      `${stubDir}/src/androidx/fragment/app/FragmentActivity.java ` +
      `${stubDir}/src/androidx/appcompat/app/AppCompatActivity.java`,
      { stdio: 'ignore' }
    );

    // Pack into jar using AdmZip
    const zip = new AdmZip();
    zip.addLocalFolder(stubDir + '/bin');
    zip.writeZip(ANDROIDX_STUBS_JAR);
  } catch (e: any) {
    console.warn('[Toolchain] Warning building androidx-stubs:', e.message);
  }
}

function createCompatOverlay() {
  fs.mkdirSync(path.join(COMPAT_RES_DIR, 'values'), { recursive: true });
  const compatXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <!-- Common AndroidX / Material Attributes -->
    <attr name="colorPrimary" format="color|reference" />
    <attr name="colorPrimaryDark" format="color|reference" />
    <attr name="colorAccent" format="color|reference" />
    <attr name="colorSecondary" format="color|reference" />
    <attr name="colorSurface" format="color|reference" />
    <attr name="colorOnPrimary" format="color|reference" />
    <attr name="colorOnSurface" format="color|reference" />
    <attr name="theme" format="reference" />
    
    <!-- Base AppCompat Themes -->
    <style name="Theme.AppCompat" parent="@android:style/Theme.DeviceDefault" />
    <style name="Theme.AppCompat.Light" parent="@android:style/Theme.DeviceDefault.Light" />
    <style name="Theme.AppCompat.NoActionBar" parent="@android:style/Theme.DeviceDefault.NoActionBar" />
    <style name="Theme.AppCompat.Light.NoActionBar" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar" />
    <style name="Theme.AppCompat.DayNight" parent="@android:style/Theme.DeviceDefault" />
    <style name="Theme.AppCompat.DayNight.NoActionBar" parent="@android:style/Theme.DeviceDefault.NoActionBar" />
    
    <!-- Material Components Themes -->
    <style name="Theme.MaterialComponents" parent="@android:style/Theme.DeviceDefault" />
    <style name="Theme.MaterialComponents.Light" parent="@android:style/Theme.DeviceDefault.Light" />
    <style name="Theme.MaterialComponents.NoActionBar" parent="@android:style/Theme.DeviceDefault.NoActionBar" />
    <style name="Theme.MaterialComponents.Light.NoActionBar" parent="@android:style/Theme.DeviceDefault.Light.NoActionBar" />
    <style name="Theme.MaterialComponents.DayNight" parent="@android:style/Theme.DeviceDefault" />
    <style name="Theme.MaterialComponents.DayNight.NoActionBar" parent="@android:style/Theme.DeviceDefault.NoActionBar" />

    <!-- Material 3 Themes -->
    <style name="Theme.Material3.DayNight" parent="@android:style/Theme.DeviceDefault" />
    <style name="Theme.Material3.DayNight.NoActionBar" parent="@android:style/Theme.DeviceDefault.NoActionBar" />
    <style name="Theme.Material3.Light" parent="@android:style/Theme.DeviceDefault.Light" />
    <style name="Theme.Material3.Dark" parent="@android:style/Theme.DeviceDefault" />

    <!-- Common Widgets -->
    <style name="Widget.AppCompat.Button" parent="@android:style/Widget.Button" />
    <style name="Widget.AppCompat.Button.Colored" parent="@android:style/Widget.Button" />
    <style name="Widget.AppCompat.Button.Borderless" parent="@android:style/Widget.Button" />
    <style name="Widget.AppCompat.TextView" parent="@android:style/Widget.TextView" />
    <style name="Widget.AppCompat.Toolbar" parent="@android:style/Widget" />
    <style name="Widget.AppCompat.ActionBar" parent="@android:style/Widget" />
    <style name="Widget.MaterialComponents.Button" parent="@android:style/Widget.Button" />
    <style name="Widget.Material3.Button" parent="@android:style/Widget.Button" />
</resources>
`;
  fs.writeFileSync(path.join(COMPAT_RES_DIR, 'values', 'compat_attrs.xml'), compatXml, 'utf-8');
}
