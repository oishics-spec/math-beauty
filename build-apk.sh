#!/bin/bash

# 构建项目
echo "构建项目..."
npm run build

# 同步到 Android 项目
echo "同步到 Android 项目..."
npx cap sync

# 打开 Android Studio
echo "打开 Android Studio..."
npx cap open android

# 提示用户构建完成后打开 APK 文件夹
echo ""
echo "========================================"
echo "构建完成后，请在 Android Studio 中执行以下操作："
echo "1. 点击 Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo "2. 构建完成后点击 'locate' 按钮"
echo "3. 或者手动打开以下文件夹："
echo "   G:\Trae\math-beauty\android\app\build\outputs\apk\debug"
echo "========================================"
