@echo off
setlocal enabledelayedexpansion

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=C:\Android\sdk"
set "ANDROID_SDK_ROOT=C:\Android\sdk"
set "Path=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\build-tools\34.0.0;%Path%"

cd /d "G:\Trae\math-beauty\android"

echo Building APK with Gradle...
echo.

call gradlew.bat assembleDebug --stacktrace

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo.
    echo Build successful!
    echo APK: %CD%\app\build\outputs\apk\debug\app-debug.apk
    start "" "app\build\outputs\apk\debug"
) else (
    echo Build may have failed.
)

endlocal
