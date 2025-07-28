@echo off
echo 🔥 Adding Windows Firewall rules for Node.js...
echo.

echo Adding rule for port 3000...
netsh advfirewall firewall add rule name="Node.js Port 3000" dir=in action=allow protocol=TCP localport=3000

echo Adding rule for port 3001...
netsh advfirewall firewall add rule name="Node.js Port 3001" dir=in action=allow protocol=TCP localport=3001

echo Adding rule for port 3002...
netsh advfirewall firewall add rule name="Node.js Port 3002" dir=in action=allow protocol=TCP localport=3002

echo.
echo ✅ Firewall rules added successfully!
echo.
echo 📱 Now try accessing from your mobile:
echo    - Test server: http://192.168.29.118:3002
echo    - Main app: http://192.168.29.118:3000
echo.
pause