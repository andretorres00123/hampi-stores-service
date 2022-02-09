import { userRepo } from '../../repos/userRepo'
import { SignUp } from './signUp'
import { SignUpController } from './signUpController'

const signUpUseCase = new SignUp(userRepo)
export const signUpController = new SignUpController(signUpUseCase)
