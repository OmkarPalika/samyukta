import { spawn } from 'child_process';

console.log('🚀 Starting Next.js server for network access...\n');

const server = spawn('npm', ['run', 'dev:network'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd()
});

server.on('error', (error) => {
  console.error('❌ Failed to start server:', error);
});

server.on('close', (code) => {
  console.log(`\n📊 Server process exited with code ${code}`);
});

// Handle Ctrl+C gracefully
process.on('SIGINT', () => {
  console.log('\n🛑 Stopping server...');
  server.kill('SIGINT');
  process.exit(0);
});

console.log('📱 Once server starts, try accessing:');
console.log('   - Local: http://localhost:3000');
console.log('   - Network: http://192.168.29.118:3000');
console.log('   - Test page: http://192.168.29.118:3000/test-auth');
console.log('\n💡 If mobile still doesn\'t work:');
console.log('   1. First test: http://192.168.29.118:3001 (simple test server)');
console.log('   2. Check Windows Firewall settings');
console.log('   3. Try different mobile browser');
console.log('   4. Ensure mobile is on same WiFi network');
console.log('\nPress Ctrl+C to stop the server');