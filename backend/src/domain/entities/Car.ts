export class Car {
    constructor(
      public id: string,
      public brand: string,
      public model: string,
      public stock: number,
      public peakSeasonPrice: number,
      public midSeasonPrice: number,
      public offSeasonPrice: number
    ) {}
  
    // Example helper method
    getPriceForSeason(season: 'peak' | 'mid' | 'off'): number {
      switch (season) {
        case 'peak':
          return this.peakSeasonPrice;
        case 'mid':
          return this.midSeasonPrice;
        case 'off':
          return this.offSeasonPrice;
        default:
          throw new Error('Invalid season');
      }
    }
  }
  