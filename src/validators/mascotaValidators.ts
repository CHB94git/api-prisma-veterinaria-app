import { NextFunction, Request, Response } from 'express';
import { body, param } from 'express-validator';
import { validateResult } from '../middleware/validateResult';


export const validatorCreatePet = [
  body('name', 'El nombre de la mascota es requerido').exists().notEmpty(),
  body('email', 'El email del propietario es requerido').exists().isEmail().withMessage('Email no válido'),
  body('gender', 'especifique un género válido').optional().isIn(['male', 'female', 'undisclosed', null]),
  body('owner', 'Nombre del propietario es requerido').exists().notEmpty(),
  body('symptoms', 'Los síntomas son requeridos').exists().isString().isLength({ min: 10 }).withMessage('Proporcione una descripción adecuada'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorMongoId = [
  param('idPet').exists().isMongoId().withMessage('MongoID no válido'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]

export const validatorUpdatePet = [
  param('idPet').exists().isMongoId().withMessage('MongoID no válido'),
  body('name').optional().notEmpty(),
  body('email').optional().isEmail().withMessage('Email no válido'),
  body('gender', 'especifique un género válido').optional().isIn(['male', 'female', 'undisclosed', null]),
  body('owner').optional().notEmpty(),
  body('symptoms').optional().isString().isLength({ min: 10 }).withMessage('Proporcione una descripción adecuada'),
  (req: Request, res: Response, next: NextFunction) => {
    validateResult(req, res, next)
  }
]