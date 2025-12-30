import { BookingResponse } from '../services/webApi/models/bookingResponse';
import { Offer } from '../services/webApi/models/offer';
import { ValidateBookingResponse } from '../services/webApi/models/validateBookingResponse';

export class BookingContext {
  offer!: Offer;
  validateResponse!: ValidateBookingResponse;
  bookingResponse!: BookingResponse;
}
