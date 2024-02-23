export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super(`The email ${email} address is already in use`);
    this.name = 'EmailAlreadyInUseError';
  }
}
