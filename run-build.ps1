$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Android\sdk"
$env:ANDROID_SDK_ROOT = "C:\Android\sdk"
$env:Path = "C:\Program Files\Java\jdk-17\bin;C:\Android\sdk\platform-tools;C:\Android\sdk\build-tools\34.0.0;" + $env:Path

Write-Host "JAVA_HOME: $env:JAVA_HOME"
Write-Host "ANDROID_HOME: $env:ANDROID_HOME"
Write-Host ""

Set-Location "G:\Trae\math-beauty\android"

Write-Host "Current directory: $(Get-Location)"
Write-Host ""

Write-Host "Running Gradle build..." -ForegroundColor Cyan
Write-Host ""

& .\gradlew.bat assembleDebug

Write-Host ""
Write-Host "Exit code: $LASTEXITCODE"
Write-Host ""

$apkPath = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug\app-debug.apk"
$apkFolder = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug"

if (Test-Path $apkPath) {
    Write-Host "Build successful!" -ForegroundColor Green
    Write-Host "APK location: $apkPath" -ForegroundColor Yellow
    Write-Host "Opening APK folder..." -ForegroundColor Yellow
    explorer.exe $apkFolder
} else {
    Write-Host "APK file not found at expected location" -ForegroundColor Red
    Write-Host "Checking build directory..."
    
    if (Test-Path "G:\Trae\math-beauty\android\app\build") {
        Get-ChildItem "G:\Trae\math-beauty\android\app\build" -Recurse -Filter "*.apk" | ForEach-Object {
            Write-Host "Found APK: $($_.FullName)" -ForegroundColor Yellow
        }
    }
}
