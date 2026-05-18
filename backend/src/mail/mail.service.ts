// backend/src/mail/mail.service.ts
import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    // Inicializamos Resend con la variable de entorno
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendOrderConfirmation(customerName: string, totalAmount: number) {
    try {
      await this.resend.emails.send({
        from: 'SAEL Sport <onboarding@resend.dev>', // Remitente por defecto de Resend en modo gratis
        to: 'tomireyes.tr@gmail.com', // !!! ACÁ PONÉ TU MAIL PERSONAL DE RESEND PARA EL DEMO
        subject: `¡Recibimos tu pedido, ${customerName}! 👕`,
        html: `
          <div style="font-family: sans-serif; background-color: #121212; color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #FF5F00; text-transform: uppercase; tracking-widest: 2px; margin-bottom: 20px;">SAEL SPORT</h1>
            <p style="font-size: 16px; color: #ccc;">¡Hola, <strong>${customerName}</strong>!</p>
            <p style="font-size: 16px; color: #ccc;">Tu pedido fue registrado con éxito bajo la modalidad de <strong>Transferencia Bancaria</strong>.</p>
            
            <div style="background-color: #1e1e1e; padding: 20px; border-radius: 8px; margin: 25px 0; border: 1px solid #2a2a2a;">
              <p style="margin: 0 0 10px 0; color: #888; font-weight: bold; text-transform: uppercase; font-size: 12px;">Total a transferir</p>
              <p style="margin: 0 0 20px 0; font-size: 32px; font-weight: bold; color: #ffffff;">$${totalAmount.toLocaleString('es-AR')}</p>
              
              <hr style="border: 0; border-top: 1px solid #333; margin-bottom: 15px;" />
              
              <p style="margin: 0 0 5px 0; color: #888; font-size: 13px;">CBU / CVU</p>
              <p style="margin: 0 0 15px 0; font-family: monospace; font-size: 16px; color: #FF5F00; font-weight: bold;">000000310001234567890</p>
              
              <p style="margin: 0 0 5px 0; color: #888; font-size: 13px;">Alias</p>
              <p style="margin: 0; font-family: monospace; font-size: 16px; color: #FF5F00; font-weight: bold;">SAEL.SPORT.MP</p>
            </div>
            
            <p style="font-size: 14px; color: #888; line-height: 1.5;">
              Una vez realizada la transferencia, por favor respondé a este correo adjuntando el comprobante de pago para que podamos preparar tu envío.
            </p>
          </div>
        `,
      });
      console.log('✉️ Correo de confirmación enviado (Modo Demo)');
    } catch (error) {
      console.error('Error al enviar el correo con Resend:', error);
    }
  }
}