export class User {
    constructor(
      public id: string,
      public email: string,
      public passwordHash: string,
      public name: string,
      public licenseNumber: string,
      public licenseValidUntil: Date,
    ) {}
  }
  