async function testAPIsWithoutAuth() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test the notifications API without auth
    console.log('📢 Testing notifications API without auth...');
    const notificationsResponse = await fetch(`${baseUrl}/api/notifications`);

    if (!notificationsResponse.ok) {
      console.error('❌ Notifications API failed:', notificationsResponse.status, await notificationsResponse.text());
    } else {
      const notificationsData = await notificationsResponse.json();
      console.log('✅ Notifications API successful:', notificationsData);
    }

    // Test the email templates API without auth
    console.log('\n📧 Testing email templates API without auth...');
    const templatesResponse = await fetch(`${baseUrl}/api/email-templates`);

    if (!templatesResponse.ok) {
      console.error('❌ Email templates API failed:', templatesResponse.status, await templatesResponse.text());
    } else {
      const templatesData = await templatesResponse.json();
      console.log('✅ Email templates API successful:', templatesData);
    }

    // Test the webpage content API without auth
    console.log('\n🌐 Testing webpage content API without auth...');
    const webpageResponse = await fetch(`${baseUrl}/api/webpage-content`);

    if (!webpageResponse.ok) {
      console.error('❌ Webpage content API failed:', webpageResponse.status, await webpageResponse.text());
    } else {
      const webpageData = await webpageResponse.json();
      console.log('✅ Webpage content API successful:', webpageData);
    }

    // Test notification stats
    console.log('\n📊 Testing notification stats API without auth...');
    const statsResponse = await fetch(`${baseUrl}/api/notifications/stats`);

    if (!statsResponse.ok) {
      console.error('❌ Notification stats API failed:', statsResponse.status, await statsResponse.text());
    } else {
      const statsData = await statsResponse.json();
      console.log('✅ Notification stats API successful:', statsData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Wait a bit for the server to start
setTimeout(testAPIsWithoutAuth, 1000);