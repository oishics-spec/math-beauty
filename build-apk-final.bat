@echo off
setlocal enabledelayedexpansion

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=C:\Android\sdk"
set "ANDROID_SDK_ROOT=C:\Android\sdk"
set "Path=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\build-tools\34.0.0;%Path%"

echo ========================================
echo Building APK for Math Beauty...
echo ========================================
echo.
echo JAVA_HOME: %JAVA_HOME%
echo ANDROID_HOME: %ANDROID_HOME%
echo.
echo Java version:
"%JAVA_HOME%\bin\java.exe" -version
echo.

cd /d "G:\Trae\math-beauty\android"

echo Current directory: %CD%
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
    echo.
    echo Checking if build directory exists...
    if exist "app\build" (
        echo Build directory exists. Contents:
        dir /s /b "app\build\*.apk" 2>nul
    ) else (
        echo Build directory does not exist.
    )
)

endlocal
