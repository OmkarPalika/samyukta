import http from 'http';

console.log('🧪 Testing network binding...\n');

// Test server that explicitly binds to all interfaces
const server = http.createServer((req, res) => {
  const clientIP = req.connection.remoteAddress || req.socket.remoteAddress;
  console.log(`📱 Connection from: ${clientIP}`);
  
  res.writeHead(200, { 
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*'
  });
  
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Network Binding Test</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body { 
                font-family: Arial, sans-serif; 
                padding: 20px; 
                background: #1a1a1a; 
                color: white; 
                text-align: center;
            }
            .success { 
                background: #2d5a27; 
                padding: 20px; 
                border-radius: 10px; 
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <h1>🎉 Network Binding Test SUCCESS!</h1>
        <div class="success">
            <h2>Connection Details:</h2>
            <p><strong>Your IP:</strong> ${clientIP}</p>
            <p><strong>Server IP:</strong> 192.168.29.118</p>
            <p><strong>Port:</strong> 3002</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        </div>
        <p>If you can see this page, network connectivity is working!</p>
        <p>The issue is with Next.js server binding, not network connectivity.</p>
    </body>
    </html>
  `);
});

// Explicitly bind to all interfaces
server.listen(3002, '0.0.0.0', () => {
  console.log('✅ Test server started successfully!');
  console.log('📍 Listening on ALL interfaces (0.0.0.0:3002)');
  console.log('');
  console.log('🌐 Try these URLs:');
  console.log('   - Local: http://localhost:3002');
  console.log('   - Network: http://192.168.29.118:3002');
  console.log('');
  console.log('📱 From your mobile, try: http://192.168.29.118:3002');
  console.log('');
  console.log('Press Ctrl+C to stop');
});

server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.log('💡 Port 3002 is already in use. Trying port 3003...');
    server.listen(3003, '0.0.0.0');
  }
});

process.on('SIGINT', () => {
  console.log('\n👋 Test server stopped');
  server.close();
  process.exit(0);
});