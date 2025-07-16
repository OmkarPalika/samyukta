@echo off
echo Starting deployment process...
echo.

echo Step 1: Cleaning build cache...
if exist .next rmdir /s /q .next
echo Build cache cleaned.
echo.

echo Step 2: Installing dependencies...
npm install
echo Dependencies installed.
echo.

echo Step 3: Building project...
npm run build
if %errorlevel% neq 0 (
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)
echo Build successful.
echo.

echo Step 4: Ready for deployment!
echo You can now:
echo 1. Run 'vercel --prod' to deploy
echo 2. Or push to Git if connected to Vercel
echo 3. Or use Vercel dashboard to redeploy
echo.

echo Deployment preparation complete!
pause