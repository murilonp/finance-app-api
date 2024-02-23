import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { PostgresCreateUserRepository } from '../repositories/postgres/create-user.js';
import { PostgresGetUserByEmailRepository } from '../repositories/postgres/get-user-by-email.js';

export class CreateUserUseCase {
  async execute(createUserParams) {
    /* TODO: verifica se o e-mail ja esta em uso */
    const postgresGetUserByEmailRepository =
      new PostgresGetUserByEmailRepository();

    const userWithProvidedEmail =
      await postgresGetUserByEmailRepository.execute(createUserParams.email);

    if (userWithProvidedEmail) {
      throw new Error('The provided e-mail is already in use');
    }

    const userId = uuidv4(); /* Gerar ID do usuário */
    const hashedPassword = await bcrypt.hash(createUserParams.password, 10);

    /* Inseri o usuário no banco */
    const user = {
      ...createUserParams,
      id: userId,
      password: hashedPassword,
    };

    /* chama o repositório */
    const postgresCreateUserRepository = new PostgresCreateUserRepository();
    const createdUser = await postgresCreateUserRepository.execute(user);

    return createdUser;
  }
}
