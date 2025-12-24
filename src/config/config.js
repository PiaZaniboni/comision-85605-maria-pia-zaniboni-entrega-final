import dotenv from 'dotenv';

dotenv.config();

export const config = {
    env: process.env.NODE_ENV || 'development',
    mail:{
        user: process.env.MAIL_USER || 'default_user',
        pass: process.env.MAIL_PASS || 'default_pass',
        from: process.env.MAIL_FROM || ''
    },
    twilio: {
        sid: process.env.TWILIO_ACCOUNT_SID || '',
        token: process.env.TWILIO_AUTH_TOKEN || '',
        phone: process.env.TWILIO_PHONE_NUMBER || ''
    }
}