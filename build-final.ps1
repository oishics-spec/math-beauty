$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Android\sdk"
$env:ANDROID_SDK_ROOT = "C:\Android\sdk"
$env:Path = "C:\Program Files\Java\jdk-17\bin;C:\Android\sdk\platform-tools;C:\Android\sdk\build-tools\34.0.0;" + $env:Path

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building APK for Math Beauty..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

Set-Location "G:\Trae\math-beauty\android"

Write-Host "Current directory: $(Get-Location)"
Write-Host ""

Write-Host "Running Gradle build..." -ForegroundColor Cyan
Write-Host ""

$process = Start-Process -FilePath ".\gradlew.bat" -ArgumentList "assembleDebug" -NoNewWindow -Wait -PassThru

Write-Host ""
Write-Host "Exit code: $($process.ExitCode)"
Write-Host ""

$apkPath = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug\app-debug.apk"
$apkFolder = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug"

if (Test-Path $apkPath) {
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Build Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "APK Location: $apkPath" -ForegroundColor Yellow
    Write-Host "Opening APK folder..." -ForegroundColor Yellow
    explorer.exe $apkFolder
} else {
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "APK file not found at expected location" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Searching for APK files..."
    
    Get-ChildItem "G:\Trae\math-beauty\android" -Recurse -Filter "*.apk" -ErrorAction SilentlyContinue | ForEach-Object {
        Write-Host "Found APK: $($_.FullName)" -ForegroundColor Yellow
    }
}
