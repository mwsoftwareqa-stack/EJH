import {PaymentContext} from '../contexts/paymentContext';

export function defaultPayment(): PaymentContext {
    const context = initPaymentContext();
    context.cardNumber = '4917610000000000';
    context.expiration = '03/30';
    context.cvv = '737';
    context.is3DSecure = true;
    context.password = 'password';
    return context;
}

export function createNon3DSecurePaymentContext(): PaymentContext {
    const context = initPaymentContext();
    context.cardNumber = '4988438843884305';
    context.expiration = '03/30';
    context.cvv = '737';
    context.is3DSecure = false;
    return context;
}

export function createFullPaymentContextWithPromoCode(promoCode: 'Multiple' | 'Multiple-TP'): PaymentContext {
    const context = createNon3DSecurePaymentContext();
    context.payWithDeposit = false;

    switch (promoCode) {
        case 'Multiple':
            context.promoCode = 'AUTOTEST-MULTIPLE-PROMO';
            break;
        case 'Multiple-TP':
            context.promoCode = 'AUTOTEST-TP-MULTIPLE-PROMO';
            break;
    }

    return context;
}

export function createCustomPaymentContext(params: {
    payWithDeposit?: boolean;
    cardNumber: string;
    expiration: string;
    cvv: string;
    is3DSecure?: boolean;
    password?: string;
    creditAmount?: number;
    promoCode?: string;
    nameOnCard?: string;
}): PaymentContext {
    const context = initPaymentContext();
    context.payWithDeposit = params.payWithDeposit ?? true;
    context.cardNumber = params.cardNumber;
    context.expiration = params.expiration;
    context.cvv = params.cvv;
    context.is3DSecure = params.is3DSecure ?? false;
    context.password = params.password;
    context.creditAmount = params.creditAmount ?? 0;
    context.promoCode = params.promoCode;
    context.nameOnCard = params.nameOnCard ?? 'Test User';
    return context;
}

function initPaymentContext(): PaymentContext {
    return new PaymentContext();
}
