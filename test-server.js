import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Network Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                background: #1a1a1a; 
                color: white; 
                text-align: center;
            }
            .status { 
                background: #2d5a27; 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0;
            }
            .info { 
                background: #2a2a2a; 
                padding: 15px; 
                border-radius: 5px; 
                margin: 10px 0;
                text-align: left;
            }
        </style>
    </head>
    <body>
        <h1>🌐 Network Connection Test</h1>
        <div class="status">
            <h2>✅ SUCCESS!</h2>
            <p>Your mobile device can reach the server!</p>
        </div>
        
        <div class="info">
            <h3>Connection Details:</h3>
            <p><strong>Server IP:</strong> 192.168.29.118</p>
            <p><strong>Port:</strong> 3001</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>User Agent:</strong> ${req.headers['user-agent'] || 'Unknown'}</p>
        </div>
        
        <div class="info">
            <h3>Next Steps:</h3>
            <p>1. If you can see this page, network connectivity is working</p>
            <p>2. The issue might be with the Next.js server or firewall</p>
            <p>3. Try accessing the main app at: <a href="http://192.168.29.118:3000" style="color: #4CAF50;">http://192.168.29.118:3000</a></p>
        </div>
        
        <script>
            console.log('Test server loaded successfully');
            document.body.style.opacity = '1';
        </script>
    </body>
    </html>
  `);
});

server.listen(3001, '0.0.0.0', () => {
  console.log('🧪 Test server running on:');
  console.log('   - Local: http://localhost:3001');
  console.log('   - Network: http://192.168.29.118:3001');
  console.log('');
  console.log('📱 Try accessing from your mobile: http://192.168.29.118:3001');
  console.log('');
  console.log('Press Ctrl+C to stop the server');
});

process.on('SIGINT', () => {
  console.log('\n👋 Test server stopped');
  process.exit(0);
});