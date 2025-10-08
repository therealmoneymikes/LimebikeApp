import {
  PaymentMethodsProps,
  PaymentMethodsType,
} from "@/types/payments/paymentMethods";
import { PaymentMethodActions } from "@/utils/reducers/paymentActions";

export const AD_BULLETS = [
  "Discounted minutes",
  "Unlimited free unlocks",
  "No subscription required",
];

export const PAYMENT_METHODS: PaymentMethodsProps[] = [
  {
    title: "Apple Pay",
    icon: "apple",
    method: PaymentMethodsType.APPLE_PAY ?? "apple_pay",
    action: PaymentMethodActions.applePay,
  },
  {
    title: "Google",
    icon: "google",
    method: PaymentMethodsType.GOOGLE_PAY ?? "google_pay",
    action: PaymentMethodActions.googlePay,
  },
  {
    title: "Add Card",
    icon: "credit-card-outline",
    method: PaymentMethodsType.ADD_CARD ?? "add_card",
    action: PaymentMethodActions.applePay,
  },
  {
    title: "Add Paypal",
    icon: "bird",
    method: PaymentMethodsType.ADD_PAYPAL ?? "add_paypal",
    action: PaymentMethodActions.applePay,
  },
];

export const REFERALS_AND_PROMOS = [
  {icon: "label", title: "Promos", action: () => console.log("Promos")},
  {icon: "gift-outline", title: "Give £4 get £4", action: () => console.log("Gifts")},
]
