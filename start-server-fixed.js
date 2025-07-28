import { spawn } from 'child_process';

console.log('🚀 Starting Next.js server with explicit network binding...\n');

// Kill any existing Node processes first
console.log('🧹 Cleaning up existing processes...');
try {
  const { execSync } = (await import('child_process'));
  execSync('taskkill /F /IM node.exe', { stdio: 'ignore' });
  console.log('✅ Cleaned up existing processes');
} catch (error) {
  console.log('ℹ️  No existing processes to clean up');
}

// Wait a moment for cleanup
setTimeout(() => {
  startServer();
}, 2000);

function startServer() {

console.log('🔧 Starting Next.js server...');

// Start Next.js with explicit host binding
const server = spawn('npx', ['next', 'dev', '--hostname', '0.0.0.0', '--port', '3000'], {
  stdio: 'inherit',
  shell: true,
  cwd: process.cwd(),
  env: {
    ...process.env,
    NODE_ENV: 'development'
  }
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

// Give instructions after a delay
setTimeout(() => {
  console.log('\n📱 Once server starts, try accessing:');
  console.log('   - Test server (should work): http://192.168.29.118:3002');
  console.log('   - Main app: http://192.168.29.118:3000');
  console.log('\n💡 If test server works but main app doesn\'t:');
  console.log('   - The issue is confirmed to be Next.js binding');
  console.log('   - We\'ll need to use a different approach');
  console.log('\nPress Ctrl+C to stop the server');
}, 3000);