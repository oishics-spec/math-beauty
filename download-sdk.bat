@echo off
setlocal enabledelayedexpansion

set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Android\sdk
set ANDROID_SDK_ROOT=C:\Android\sdk

echo ========================================
echo Step 1: Downloading Android SDK Platform Tools...
echo ========================================
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/platform-tools-latest-windows.zip' -OutFile 'C:\Android\platform-tools.zip' -UseBasicParsing"
powershell -Command "Expand-Archive -Path 'C:\Android\platform-tools.zip' -DestinationPath 'C:\Android\sdk' -Force"

echo ========================================
echo Step 2: Downloading Android SDK Platform 34...
echo ========================================
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/platform-34_r01.zip' -OutFile 'C:\Android\platform-34.zip' -UseBasicParsing"
powershell -Command "New-Item -ItemType Directory -Force -Path 'C:\Android\sdk\platforms\android-34' | Out-Null"
powershell -Command "Expand-Archive -Path 'C:\Android\platform-34.zip' -DestinationPath 'C:\Android\sdk\platforms\android-34' -Force"

echo ========================================
echo Step 3: Downloading Android SDK Build Tools 34...
echo ========================================
powershell -Command "Invoke-WebRequest -Uri 'https://dl.google.com/android/repository/build-tools_r34-windows.zip' -OutFile 'C:\Android\build-tools-34.zip' -UseBasicParsing"
powershell -Command "New-Item -ItemType Directory -Force -Path 'C:\Android\sdk\build-tools\34.0.0' | Out-Null"
powershell -Command "Expand-Archive -Path 'C:\Android\build-tools-34.zip' -DestinationPath 'C:\Android\sdk\build-tools\34.0.0' -Force"

echo ========================================
echo Done! Android SDK components installed.
echo ========================================
pause
