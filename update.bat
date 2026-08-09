@echo off
cd /d %~dp0
git add .
git commit -m "Weekend update"
git push
pause