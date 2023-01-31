import { Veterinary } from '@prisma/client'
import nodemailer from 'nodemailer'

export const registerEmail = async (data: Partial<Veterinary>) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.mailtrap.io",
    port: Number(process.env.EMAIL_PORT) || 2525,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  // Pick<Veterinary, 'email' | 'name' | 'token'>

  const { email, name, token } = data

  const emailToSend = await transporter.sendMail({
    from: "APV - Administrador de Pacientes de Veterinaria",
    to: email,
    subject: 'Comprueba tu cuenta en APV',
    text: 'Comprueba tu cuenta en APV',
    html: `
            <p> Hola: ${ name }, haz creado una cuenta en nuestro sitio, por favor comprueba tu cuenta en APV. </p>

            <p> Tu cuenta está lista, solo debes comprobarla en el siguiente enlace: 
            <a href="${ process.env.FRONTEND_URL }/confirm/${ token }"> Comprobar cuenta </a> </p>
        

            <p> Sí tu no creaste está cuenta, puedes ignorar este mensaje </p>
        `
  })
  console.log('Mensaje enviado: %s', emailToSend.messageId)
}