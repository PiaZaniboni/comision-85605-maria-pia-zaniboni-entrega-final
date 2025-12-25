import nodemailer from 'nodemailer';

const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, FRONTEND_URL } = process.env;
export class EmailService {
  constructor() {
    // Configurar transporter de nodemailer
    this.transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: false,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  /**
   * Enviar email de recuperacion de contraseña
   */
  async sendPasswordResetEmail(email, token) {
    const resetLink = `${FRONTEND_URL}/reset-password/${token}`;
    
    const mailOptions = {
      from:  EMAIL_FROM,
      to:  email,
      subject: 'Backend II - Recuperar contraseña',
      html: `
        <! DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              display: inline-block; 
              padding: 12px 24px; 
              background-color: #007bff; 
              color: white; 
              text-decoration: none; 
              border-radius: 5px;
              margin: 20px 0;
            }
            . footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Recuperar Contraseña</h2>
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer tu contraseña.  Haz clic en el botón de abajo para crear una nueva contraseña: </p>
            
            <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            
            <p>O copia y pega este enlace en tu navegador:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            
            <p><strong>Este enlace expirará en 1 hora.</strong></p>
            
            <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
            
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', info.messageId);
      return { success: true, messageId:  info.messageId };
    } catch (error) {
      console.error('❌ Error enviando email:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Email de confirmacion de compra
   */
  async sendPurchaseConfirmation(email, ticket) {
    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `Backend II - Confirmacion de compra - Ticket ${ticket.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin:  0 auto; padding: 20px; }
            .ticket-info { background-color: #f8f9fa; padding:  15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>¡Gracias por tu compra!</h2>
            <div class="ticket-info">
              <p><strong>Código de ticket:</strong> ${ticket.code}</p>
              <p><strong>Fecha: </strong> ${new Date(ticket.purchase_datetime).toLocaleString()}</p>
              <p><strong>Total:</strong> $${ticket.amount}</p>
            </div>
            <p>Tu pedido ha sido procesado exitosamente. </p>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await this. transporter.sendMail(mailOptions);
      console.log('✅ Email de compra enviado:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Error enviando email de compra:', error);
      throw new Error('Failed to send purchase email');
    }
  }

  /**
   * Verificar conexion con el servidor de email
   */
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor de email listo');
      return true;
    } catch (error) {
      console.error('❌ Error verificando servidor de email:', error);
      return false;
    }
  }
}