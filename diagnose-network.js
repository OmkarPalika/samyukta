import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function diagnoseNetwork() {
  console.log('🔍 Network Diagnostics for Mobile Access\n');
  
  try {
    // Check if port 3000 is listening
    console.log('1. Checking if port 3000 is listening...');
    try {
      const { stdout: netstat } = await execAsync('netstat -an | findstr :3000');
      console.log('✅ Port 3000 status:');
      console.log(netstat);
    } catch (error) {
      console.log('⚠️  Port 3000 not found or not listening');
    }
    
    // Check Windows Firewall status
    console.log('\n2. Checking Windows Firewall...');
    try {
      const { stdout: firewall } = await execAsync('netsh advfirewall show allprofiles state');
      console.log('🔥 Firewall status:');
      console.log(firewall);
    } catch (error) {
      console.log('⚠️  Could not check firewall status (may need admin rights)');
    }
    
    // Check network interface
    console.log('\n3. Network interface information:');
    const { stdout: ipconfig } = await execAsync('ipconfig | findstr "IPv4\\|Subnet\\|Gateway"');
    console.log('🌐 Network config:');
    console.log(ipconfig);
    
    // Test local connectivity
    console.log('\n4. Testing local connectivity...');
    try {
      const { stdout: ping } = await execAsync('ping -n 1 192.168.29.118');
      console.log('✅ Local ping successful');
    } catch (error) {
      console.log('❌ Local ping failed');
    }
    
    console.log('\n📋 Troubleshooting Steps:');
    console.log('1. Try the test server: http://192.168.29.118:3001');
    console.log('2. If test server works, the issue is with Next.js');
    console.log('3. If test server fails, check:');
    console.log('   - Windows Firewall settings');
    console.log('   - Router/WiFi settings');
    console.log('   - Mobile device network settings');
    console.log('4. Try temporarily disabling Windows Firewall');
    console.log('5. Check if antivirus is blocking connections');
    
    console.log('\n🔧 Quick Fixes to Try:');
    console.log('1. Restart the development server');
    console.log('2. Clear mobile browser cache');
    console.log('3. Try a different mobile browser');
    console.log('4. Connect mobile to 5GHz WiFi if available');
    console.log('5. Check if mobile has any VPN/proxy enabled');
    
  } catch (error) {
    console.error('❌ Error during diagnosis:', error.message);
  }
}

diagnoseNetwork();