export class PaymentContext {
    payWithDeposit: boolean = true;
    nameOnCard: string = 'Test User';
    cardNumber!: string;
    expiration!: string;
    cvv!: string;
    is3DSecure: boolean = false;
    password?: string;
    creditAmount: number = 0;
    promoCode?: string;
  }
