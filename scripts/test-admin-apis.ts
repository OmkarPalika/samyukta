import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function testAdminAPIs() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // First, login to get the auth token
    console.log('🔐 Logging in as admin...');
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@samyukta.com',
        password: 'admin123'
      })
    });

    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status} ${loginResponse.statusText}`);
    }

    const loginData = await loginResponse.json();
    console.log('✅ Login successful:', loginData);

    // Extract the auth token from cookies
    const cookies = loginResponse.headers.get('set-cookie');
    console.log('🍪 Cookies:', cookies);

    if (!cookies) {
      throw new Error('No auth token received');
    }

    // Test the notifications API
    console.log('\n📢 Testing notifications API...');
    const notificationsResponse = await fetch(`${baseUrl}/api/notifications`, {
      headers: {
        'Cookie': cookies
      }
    });

    if (!notificationsResponse.ok) {
      console.error('❌ Notifications API failed:', notificationsResponse.status, await notificationsResponse.text());
    } else {
      const notificationsData = await notificationsResponse.json();
      console.log('✅ Notifications API successful:', notificationsData);
    }

    // Test the email templates API
    console.log('\n📧 Testing email templates API...');
    const templatesResponse = await fetch(`${baseUrl}/api/email-templates`, {
      headers: {
        'Cookie': cookies
      }
    });

    if (!templatesResponse.ok) {
      console.error('❌ Email templates API failed:', templatesResponse.status, await templatesResponse.text());
    } else {
      const templatesData = await templatesResponse.json();
      console.log('✅ Email templates API successful:', templatesData);
    }

    // Test the webpage content API
    console.log('\n🌐 Testing webpage content API...');
    const webpageResponse = await fetch(`${baseUrl}/api/webpage-content`, {
      headers: {
        'Cookie': cookies
      }
    });

    if (!webpageResponse.ok) {
      console.error('❌ Webpage content API failed:', webpageResponse.status, await webpageResponse.text());
    } else {
      const webpageData = await webpageResponse.json();
      console.log('✅ Webpage content API successful:', webpageData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Wait a bit for the server to start
setTimeout(testAdminAPIs, 2000);