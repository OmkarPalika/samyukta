async function testEmailTemplatePost() {
  const baseUrl = 'http://localhost:3000';
  
  try {
    console.log('📧 Testing email template POST API...');
    
    const templateData = {
      name: 'Test Template',
      type: 'announcement',
      subject: 'Test Subject',
      html_content: '<h1>Test HTML Content</h1>',
      text_content: 'Test text content',
      variables: [],
      is_active: true
    };

    const response = await fetch(`${baseUrl}/api/email-templates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData)
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Email template POST failed:', response.status, errorText);
    } else {
      const responseData = await response.json();
      console.log('✅ Email template POST successful:', responseData);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Wait a bit for the server to start
setTimeout(testEmailTemplatePost, 1000);