@echo off
echo ========================================
echo 数学之美 - GitHub 自动构建 APK
echo ========================================
echo.
echo 此脚本将帮助你：
echo 1. 初始化 Git 仓库
echo 2. 添加所有文件
echo 3. 创建首次提交
echo.
echo ========================================
echo.

cd /d "G:\Trae\math-beauty"

echo Step 1: 初始化 Git 仓库...
git init
echo.

echo Step 2: 添加所有文件...
git add .
echo.

echo Step 3: 创建首次提交...
git commit -m "Initial commit: 数学之美屏保应用"
echo.

echo ========================================
echo Git 仓库初始化完成！
echo ========================================
echo.
echo 接下来请执行以下步骤：
echo.
echo 1. 在 GitHub 上创建一个新仓库
echo    访问: https://github.com/new
echo    仓库名称: math-beauty
echo    设为 Public（公开）
echo    不要勾选 "Add a README file"
echo.
echo 2. 复制仓库地址（例如: https://github.com/你的用户名/math-beauty.git）
echo.
echo 3. 执行以下命令推送代码：
echo    git remote add origin https://github.com/你的用户名/math-beauty.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 4. 等待 GitHub Actions 自动构建完成
echo    访问: https://github.com/你的用户名/math-beauty/actions
echo.
echo 5. 构建完成后下载 APK
echo    在 Actions 页面点击最新的 workflow
echo    在 Artifacts 中下载 math-beauty-apk
echo.
echo ========================================
pause
