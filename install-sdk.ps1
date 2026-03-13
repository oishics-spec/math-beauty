$env:JAVA_HOME = "C:\Program Files\Java\jdk-17"
$env:ANDROID_HOME = "C:\Android\sdk"
$env:ANDROID_SDK_ROOT = "C:\Android\sdk"

Write-Host "Installing Android SDK components..."

Set-Location "C:\Android\sdk\cmdline-tools\latest\bin"

# Accept all licenses
"y" * 10 | .\sdkmanager.bat --sdk_root="C:\Android\sdk" --licenses

# Install required components
"y" | .\sdkmanager.bat --sdk_root="C:\Android\sdk" "platform-tools" "platforms;android-34" "build-tools;34.0.0"

Write-Host "Done!"
