@echo off
setlocal

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=C:\Android\sdk"
set "ANDROID_SDK_ROOT=C:\Android\sdk"
set "Path=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\build-tools\34.0.0;%Path%"

echo JAVA_HOME=%JAVA_HOME%
echo ANDROID_HOME=%ANDROID_HOME%
echo.

cd /d "G:\Trae\math-beauty\android"

echo Current directory: %CD%
echo.

echo Running Gradle build...
echo.

call gradlew.bat assembleDebug --info

echo.
echo Exit code: %ERRORLEVEL%
echo.

if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo Build successful!
    echo APK location: %CD%\app\build\outputs\apk\debug\app-debug.apk
    start "" "app\build\outputs\apk\debug"
) else (
    echo Build may have failed or APK not found.
)

endlocal
