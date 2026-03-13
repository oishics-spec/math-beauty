@echo off
setlocal enabledelayedexpansion

echo ========================================
echo Setting up build environment...
echo ========================================
echo.

setx JAVA_HOME "C:\Program Files\Java\jdk-17" /M >nul 2>&1
setx ANDROID_HOME "C:\Android\sdk" /M >nul 2>&1
setx ANDROID_SDK_ROOT "C:\Android\sdk" /M >nul 2>&1

echo Environment variables set.
echo.

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=C:\Android\sdk"
set "ANDROID_SDK_ROOT=C:\Android\sdk"
set "Path=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\build-tools\34.0.0;%Path%"

echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.

cd /d "G:\Trae\math-beauty\android"

echo Current directory: %CD%
echo.

echo Testing Java...
"%JAVA_HOME%\bin\java.exe" -version
echo.

echo Running Gradle build...
echo.

call gradlew.bat assembleDebug --stacktrace

echo.
echo Exit code: %ERRORLEVEL%
echo.

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo ========================================
    echo Build Successful!
    echo ========================================
    echo.
    echo APK Location: %CD%\app\build\outputs\apk\debug\app-debug.apk
    echo.
    echo Opening APK folder...
    start "" "app\build\outputs\apk\debug"
) else (
    echo ========================================
    echo APK file not found at expected location
    echo ========================================
)

endlocal
