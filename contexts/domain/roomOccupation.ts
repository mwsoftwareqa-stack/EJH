import { createAdult, createChild, createInfant, GuestData } from './guestData';

export class RoomOccupation {
  adults: number = 0;
  children: number = 0;
  infants: number = 0;
  childrenAges: number[] = [];

  adultGuests: GuestData[] = [];
  childGuests: GuestData[] = [];
  infantGuests: GuestData[] = [];

  populateGuestsData(withLead: boolean, language: string = 'English') {
    const adultCount = withLead ? this.adults - 1 : this.adults;
    this.adultGuests.push(...Array.from({ length: adultCount }, () => createAdult(language)));

    if (this.childrenAges.length !== this.children) {
      this.childrenAges = Array(this.children).fill(10);
    }

    this.childGuests.push(...this.childrenAges.map(age => createChild(age, language)));
    this.infantGuests.push(...Array.from({ length: this.infants }, () => createInfant()));
  }
}
