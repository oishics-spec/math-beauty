@echo off
echo ========================================
echo 推送代码到 GitHub
echo ========================================
echo.
cd /d "G:\Trae\math-beauty"
echo 当前目录: %CD%
echo.
echo 正在推送代码...
git push -u origin main
echo.
echo 完成！
echo.
pause
