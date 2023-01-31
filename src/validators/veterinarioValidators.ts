import { NextFunction, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { prisma } from '../database/prismaClient';
import { validateResult } from '../middleware/validateResult';


export const validatorCreateVet = [
  body('name', 'El nombre es requerido').exists().trim().isLength({ min: 3, max: 60 }).withMessage('El nombre debe estar entre 3 y 60 caracteres'),
  body('email', 'El email es requerido').exists().trim().isEmail().withMessage('No es un email válido').normalizeEmail().custom(async (value) => {
    return await prisma.veterinary.findUnique({ where: { email: value } }).then(user => {
      if (user)
        return Promise.reject(`Email de usuario ${ value } ya está registrado!`)
    })
  }),
  body('password', 'La contraseña es requerida').exists().isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').matches(/\d/).withMessage('Debe contener al menos un número'),
  body('phone', 'El teléfono debe ser númerico').optional().isNumeric(),
  body('web', 'Provea un String/URL válido').optional().isString().isURL(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorLogin = [
  body('email', 'El campo email es requerido').exists().trim().isEmail(),
  body('password', 'La contraseña es requerida').exists().isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorForgetMyPassword = [
  body('email', 'El email es requerido').exists().trim().isEmail().withMessage('No es un email válido'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorGenerateNewPassword = [
  param('token').exists().isString().isLength({ min: 15 }).withMessage('Proporcione un token válido'),
  body('password', 'La nueva contraseña es requerida').exists().isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').matches(/\d/).withMessage('Debe contener al menos un número'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorConfirmRegister = [
  param('token').exists().isString().isLength({ min: 15 }).withMessage('Proporcione un token válido'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorUpdateProfile = [
  body('name').optional().trim().isLength({ min: 3, max: 60 }).withMessage('El nuevo nombre debe estar entre 3 y 60 caracteres'),
  body('email').optional().trim().isEmail().withMessage('No es un email válido').normalizeEmail(),
  body('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').matches(/\d/).withMessage('Debe contener al menos un número'),
  body('phone', 'El teléfono debe ser númerico').optional().isNumeric(),
  body('web', 'Provea un String/URL válido').optional().isString().isURL(),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorUpdatePassword = [
  body('current_password', 'La contraseña actual es requerida').exists().trim(),
  body('new_password', 'La nueva contraseña es requerida').exists().isLength({ min: 6 }).withMessage('La contraseña debe ser de mínimo 6 caracteres').matches(/\d/).withMessage('Debe contener al menos un número'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]