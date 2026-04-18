const axios = require('axios');

async function testChat() {
  try {
    console.log('🧪 Testing chat API...');
    
    // First get a character ID
    const charsRes = await axios.get('http://localhost:5000/character');
    const firstChar = charsRes.data[0];
    console.log('✅ Found character:', firstChar.name, '(ID:', firstChar.id, ')');
    
    // Now send a message
    console.log('📤 Sending test message...');
    const chatRes = await axios.post('http://localhost:5000/chat', {
      message: 'Hello!',
      characterId: firstChar.id
    });
    
    console.log('✅ Response:', chatRes.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    console.error('Status:', error.response?.status);
  }
}

testChat();
