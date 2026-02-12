import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLoginNotification(email: string, ipAddress: string | null): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: 'Novo login detectado',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B50B8;">Login Detectado</h2>
          <p>Um novo login foi realizado na sua conta de administrador do Portfolio.</p>
          <p><strong>IP:</strong> ${ipAddress || 'Desconhecido'}</p>
          <p><strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            Se você não reconhece este login, altere sua senha imediatamente.
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send login notification:', error)
  }
}

export async function sendMFACode(email: string, code: string): Promise<boolean> {
  try {
    await resend.emails.send({
      from: 'Portfolio Admin <onboarding@resend.dev>',
      to: email,
      subject: 'Código de verificação',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B50B8;">Código de Verificação</h2>
          <p>Use o código abaixo para completar seu login:</p>
          <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1C1917;">
              ${code}
            </span>
          </div>
          <p style="color: #666;">Este código expira em 5 minutos.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            Se você não solicitou este código, ignore este email.
          </p>
        </div>
      `,
    })
    return true
  } catch (error) {
    console.error('Failed to send MFA code:', error)
    return false
  }
}

export async function sendContactNotification(
  adminEmail: string,
  contactData: { name: string; email: string; projectType: string; message: string }
): Promise<void> {
  try {
    await resend.emails.send({
      from: 'Portfolio <onboarding@resend.dev>',
      to: adminEmail,
      subject: `Nova mensagem de ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6B50B8;">Nova Mensagem de Contato</h2>
          <p><strong>Nome:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Tipo de Projeto:</strong> ${contactData.projectType}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Mensagem:</strong></p>
          <p style="background: #f5f5f4; padding: 15px; border-radius: 8px;">
            ${contactData.message}
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send contact notification:', error)
  }
}
