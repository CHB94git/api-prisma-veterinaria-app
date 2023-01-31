import { Router } from 'express';
import 'express-async-errors';
import * as PetController from '../controllers/mascota';
import checkAuthMiddleware from '../middleware/checkAuth';
import { validatorCreatePet, validatorMongoId, validatorUpdatePet } from '../validators/mascotaValidators';


const router = Router()

router.route('/')
  .get(checkAuthMiddleware, PetController.getAllPets)
  .post(checkAuthMiddleware, validatorCreatePet, PetController.createPet)

router.route('/:idPet')
  .get(checkAuthMiddleware, validatorMongoId, PetController.getOnePet)
  .put(checkAuthMiddleware, validatorUpdatePet, PetController.updatePet)
  .delete(checkAuthMiddleware, validatorMongoId, PetController.deletePet)

export default router