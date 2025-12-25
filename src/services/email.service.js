import nodemailer from 'nodemailer';
import { TicketDTO } from '../dto/ticket.dto.js';

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

    const ticketData = TicketDTO.forEmail(ticket);
    
    const productsTableRows = ticketData.products.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <strong>${item.title}</strong><br>
          <small style="color: #666;">Código: ${item.code}</small>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">$${item.price.toLocaleString('es-AR')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;"><strong>$${item.subtotal.toLocaleString('es-AR')}</strong></td>
      </tr>
    `).join('');

    const mailOptions = {
      from: EMAIL_FROM,
      to: email,
      subject: `✅ Confirmación de compra - Ticket ${ticketData.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              background-color: #f4f4f4;
              margin: 0;
              padding: 0;
            }
            .container { 
              max-width: 600px; 
              margin: 20px auto; 
              background-color: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .header {
              background-color: #28a745;
              color: white;
              padding: 30px 20px;
              text-align:  center;
            }
            . header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 30px 20px;
            }
            .ticket-info { 
              background-color: #f8f9fa; 
              padding: 20px; 
              border-radius:  5px; 
              margin: 20px 0; 
              border-left: 4px solid #28a745;
            }
            .ticket-info p {
              margin: 8px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th {
              background-color: #f8f9fa;
              padding: 12px 10px;
              text-align:  left;
              font-weight: bold;
              border-bottom: 2px solid #dee2e6;
            }
            . total-row {
              background-color: #f8f9fa;
              font-weight: bold;
              font-size: 18px;
            }
            .total-row td {
              padding: 15px 10px;
              border-top: 2px solid #28a745;
            }
            .footer { 
              background-color: #f8f9fa;
              padding: 20px; 
              text-align: center;
              font-size: 12px; 
              color: #666; 
            }
            .success-icon {
              font-size: 48px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✓</div>
              <h1>¡Gracias por tu compra!</h1>
            </div>
            
            <div class="content">
              <p>Hola,</p>
              <p>Tu pedido ha sido procesado exitosamente. A continuación encontrarás los detalles de tu compra:</p>
              
              <div class="ticket-info">
                <p><strong>📋 Código de ticket:</strong> ${ticketData. code}</p>
                <p><strong>📅 Fecha: </strong> ${ticketData.purchase_datetime}</p>
                <p><strong>👤 Comprador:</strong> ${ticketData.purchaser}</p>
              </div>

              <h3>📦 Productos adquiridos:</h3>
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th style="text-align: center;">Cantidad</th>
                    <th style="text-align: right;">Precio Unit.</th>
                    <th style="text-align: right;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${productsTableRows}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right;">TOTAL: </td>
                    <td style="text-align: right; color: #28a745;">$${ticketData.amount.toLocaleString('es-AR')}</td>
                  </tr>
                </tbody>
              </table>

              <p>Recibirás una notificación cuando tu pedido sea enviado. </p>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            </div>

            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
              <p>&copy; ${new Date().getFullYear()} Tu Tienda.  Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
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