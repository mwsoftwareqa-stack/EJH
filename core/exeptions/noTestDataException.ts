export class NoTestDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NoTestDataException';
  }
}
