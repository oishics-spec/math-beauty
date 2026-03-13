@echo off
setlocal enabledelayedexpansion

set "JAVA_HOME=C:\Program Files\Java\jdk-17"
set "ANDROID_HOME=C:\Android\sdk"
set "ANDROID_SDK_ROOT=C:\Android\sdk"
set "Path=%JAVA_HOME%\bin;%ANDROID_HOME%\platform-tools;%ANDROID_HOME%\build-tools\34.0.0;%Path%"

cd /d "G:\Trae\math-beauty\android"

echo ========================================
echo Building APK for Math Beauty...
echo ========================================
echo.

call gradlew.bat assembleDebug

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Build Successful!
    echo ========================================
    echo.
    
    set "APK_PATH=G:\Trae\math-beauty\android\app\build\outputs\apk\debug\app-debug.apk"
    set "APK_FOLDER=G:\Trae\math-beauty\android\app\build\outputs\apk\debug"
    
    if exist "%APK_PATH%" (
        echo APK Location: %APK_PATH%
        echo Opening APK folder...
        explorer.exe "%APK_FOLDER%"
    ) else (
        echo APK file not found at expected location
    )
) else (
    echo.
    echo ========================================
    echo Build Failed!
    echo ========================================
)

endlocal
