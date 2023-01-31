import { Veterinary } from '@prisma/client'
import nodemailer from 'nodemailer'

export const emailForgetPassword = async (data: Pick<Veterinary, 'email' | 'name' | 'token'>) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const { email, name, token } = data

  const emailInfo = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: 'Restablece tu contraseña',
    text: 'Restablece tu contraseña',
    html: `
        <p> Hola: ${ name }, ha solicitado restablecer su contraseña. </p>

        <p> Ve al siguiente enlace para generar una nueva contraseña: 
        <a href="${ process.env.FRONTEND_URL }/forget-password/${ token }"> Restablecer contraseña </a> </p>
    

        <p> Sí tu no creaste esta cuenta, puedes ignorar este mensaje </p>
    `
  })

  console.log('Mensaje enviado: %s', emailInfo.messageId)
}