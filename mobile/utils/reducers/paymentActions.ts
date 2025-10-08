import { PaymentMethodsType } from "@/types/payments/paymentMethods";


export class PaymentMethodActions {
  static applePay(
    setPaymentMethod: (op: PaymentMethodsType) => void,
    handler?: Function
  ): void {
    setPaymentMethod(PaymentMethodsType.APPLE_PAY);
    if (handler) handler();
  }
  static googlePay(
    setPaymentMethod: (op: PaymentMethodsType) => void,
    handler?: Function
  ): void {
    setPaymentMethod(PaymentMethodsType.GOOGLE_PAY);
    if (handler) handler();
  }
  static addCard(
    setPaymentMethod: (op: PaymentMethodsType) => void,
    handler?: Function
  ): void {
    setPaymentMethod(PaymentMethodsType.ADD_CARD);
    if (handler) handler();
  }
  static addPaypal(
    setPaymentMethod: (op: PaymentMethodsType) => void,
    handler?: Function
  ): void {
    setPaymentMethod(PaymentMethodsType.ADD_CARD);
    if (handler) handler();
  }
}
