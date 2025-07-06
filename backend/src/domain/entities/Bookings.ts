export class Booking {
    constructor(
      public id: string,
      public userId: string,
      public carId: string,
      public dateFrom: Date,
      public dateTo: Date,
      public totalPrice: number,
    ) {}
 
    // Business logic: check overlapping dates
    overlaps(other: Booking): boolean {
      return this.dateFrom <= other.dateTo && this.dateTo >= other.dateFrom;
    }
  }
  