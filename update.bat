@echo off
echo ===============================
echo   Qasim Glass Auto Update
echo ===============================
echo.

cd /d %~dp0

git pull origin main --rebase
git add .
git commit -m "Website update"
git push origin main

echo.
echo ✅ Website Successfully Updated!
pause