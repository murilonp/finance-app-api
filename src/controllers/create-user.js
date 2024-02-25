import { CreateUserUseCase } from '../use-cases/create-user.js';
import validator from 'validator';
import { badRequest, created, serverError } from './helpers.js';
import { EmailAlreadyInUseError } from '../errors/user.js';

export class CreateUserController {
  async execute(httpRequest) {
    try {
      const params = httpRequest.body;
      /* Validar a requisição de compos obrigatórios tamanho de senha, e-mail...*/
      const requiredFields = ['first_name', 'last_name', 'email', 'password'];

      for (const field of requiredFields) {
        if (!params[field] || params[field].trim().length === 0) {
          return badRequest({ message: `Missing param: ${field}` });
        }
      }

      const passwordIsNotValid = params.password.length < 6;

      if (passwordIsNotValid) {
        return badRequest({
          message: 'Password must be at least 6 characters',
        });
      }

      const emailIsValid = validator.isEmail(params.email);

      if (!emailIsValid) {
        return badRequest({
          message: 'Invalid e-mail. Please enter a valid e-mail address',
        });
      }

      /* Chama o use case */
      const createUserUseCase = new CreateUserUseCase();
      const createdUser = await createUserUseCase.execute(params);

      /* Retorna uma resposta para o usuário: status code */
      return created(createdUser);
    } catch (error) {
      if (error instanceof EmailAlreadyInUseError) {
        return badRequest({ message: error.message });
      }
      console.log(error);
      return serverError();
    }
  }
}
