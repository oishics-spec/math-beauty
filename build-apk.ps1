$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Android\sdk"
$env:ANDROID_SDK_ROOT = "C:\Android\sdk"
$env:Path += ";C:\Program Files\Java\jdk-17\bin"

Set-Location "G:\Trae\math-beauty\android"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Building APK for Math Beauty..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

& .\gradlew.bat assembleDebug

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Build Successful!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    
    $apkPath = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug\app-debug.apk"
    $apkFolder = "G:\Trae\math-beauty\android\app\build\outputs\apk\debug"
    
    if (Test-Path $apkPath) {
        Write-Host "APK Location: $apkPath" -ForegroundColor Yellow
        Write-Host "Opening APK folder..." -ForegroundColor Yellow
        explorer.exe $apkFolder
    } else {
        Write-Host "APK file not found at expected location" -ForegroundColor Red
    }
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "Build Failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
}
