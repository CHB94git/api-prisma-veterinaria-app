import { Router } from 'express';
import 'express-async-errors';
import * as VeterinarioController from '../controllers/veterinario';
import checkAuthMiddleware from '../middleware/checkAuth';
import { validatorConfirmRegister, validatorCreateVet, validatorForgetMyPassword, validatorGenerateNewPassword, validatorLogin, validatorUpdatePassword, validatorUpdateProfile } from '../validators/veterinarioValidators';

const router = Router()

router.route('/')
  .get(VeterinarioController.getAllVets)
  .post(validatorCreateVet, VeterinarioController.createVet)

router.post('/login', validatorLogin, VeterinarioController.login)
router.get('/confirm/:token', validatorConfirmRegister, VeterinarioController.confirmRegister)
router.post('/forget-password', validatorForgetMyPassword, VeterinarioController.forgetMyPassword)

router.route('/forget-password/:token')
  .get(VeterinarioController.verifyOneTimeUseToken)
  .post(validatorGenerateNewPassword, VeterinarioController.generateNewPassword)

router.route('/profile')
  .get(checkAuthMiddleware, VeterinarioController.profile)
  .put(checkAuthMiddleware, validatorUpdateProfile, VeterinarioController.updateProfileInfo)

router.patch('/update-password', checkAuthMiddleware, validatorUpdatePassword, VeterinarioController.updatePassword)

router.get('/:idVet', VeterinarioController.getDetailsOneVet)


export default router