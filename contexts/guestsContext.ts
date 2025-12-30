import { GuestData } from '../contexts/domain/guestData';
import {
	createLeadPassenger,
	LeadGuestData,
} from '../contexts/domain/leadGuestData';
import { RoomOccupation } from '../contexts/domain/roomOccupation';

export class GuestsContext {
  rooms: RoomOccupation[] = [];
  leadPassenger: LeadGuestData;

  constructor() {
    this.leadPassenger = createLeadPassenger();
  }

  get adults(): number {
    return this.rooms.reduce((sum, room) => sum + room.adults, 0);
  }

  get children(): number {
    return this.rooms.reduce((sum, room) => sum + room.children, 0);
  }

  get infants(): number {
    return this.rooms.reduce((sum, room) => sum + room.infants, 0);
  }

  get totalGuestsCount(): number {
    return this.adults + this.children + this.infants;
  }

  get roomsCount(): number {
    return this.rooms.length;
  }

  get childAges(): number[] {
    return this.childGuests.map(g => g.age);
  }

  get adultGuests(): GuestData[] {
    return this.rooms.flatMap(r => r.adultGuests);
  }

  get childGuests(): GuestData[] {
    return this.rooms.flatMap(r => r.childGuests);
  }

  get infantGuests(): GuestData[] {
    return this.rooms.flatMap(r => r.infantGuests);
  }

  get allGuests(): GuestData[] {
    return [...this.adultGuests, ...this.childGuests, ...this.infantGuests];
  }

  populateGuestsData(language: string = 'English') {
    if (this.rooms.length === 0) return;

    this.rooms[0].adultGuests.push(this.leadPassenger);
    this.rooms[0].populateGuestsData(true, language);

    for (const room of this.rooms.slice(1)) {
      room.populateGuestsData(false, language);
    }
  }
}
