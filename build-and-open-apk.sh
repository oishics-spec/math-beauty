#!/bin/bash

# 构建项目
echo "构建项目..."
npm run build

# 同步到 Android 项目
echo "同步到 Android 项目..."
npx cap sync

# 构建 APK
echo "构建 APK..."
cd android && ./gradlew assembleDebug

# 检查 APK 文件是否生成
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
    echo "APK 构建成功！"
    echo "APK 文件路径：$(pwd)/$APK_PATH"
    
    # 打开 APK 所在文件夹
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        explorer.exe "$(pwd)/app/build/outputs/apk/debug"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        open "$(pwd)/app/build/outputs/apk/debug"
    else
        # Linux
        xdg-open "$(pwd)/app/build/outputs/apk/debug"
    fi
else
    echo "APK 构建失败！"
    echo "请检查构建日志。"
fi
