@echo off
set JAVA_HOME=C:\Program Files\Java\jdk-17
set ANDROID_HOME=C:\Android\sdk
set ANDROID_SDK_ROOT=C:\Android\sdk

echo Installing Android SDK components...
cd /d C:\Android\sdk\cmdline-tools\latest\bin

echo y | sdkmanager.bat --sdk_root=C:\Android\sdk --licenses
echo y | sdkmanager.bat --sdk_root=C:\Android\sdk platform-tools platforms;android-34 build-tools;34.0.0

echo Done!
pause
