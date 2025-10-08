import { MCIcons, FTIcons } from "../icons/iconTypes";

export enum PaymentMethodsType {
  APPLE_PAY = "apple_pay",
  GOOGLE_PAY = "google_pay",
  ADD_CARD = "add_card",
  ADD_PAYPAL = "add_paypal",
}

export interface PaymentMethodsProps {
  title: string;
  icon: MCIcons | FTIcons;
  method: PaymentMethodsType;
  action: Function;
}
