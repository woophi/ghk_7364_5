import { round } from './round';

export const calcIncomeByMonths = (amount: number, annualRate: number, months: number) => {
  return round(amount * annualRate * (months / 12), 2);
};

const TAX = 0.13;

export function calculateTaxRefund(sumContributions: number): number {
  return round(sumContributions * TAX, 2);
}

const MAX_GOV_SUPPORT = 360_000;
const INVEST_DURATION = 15;
const SUBSIDY_RATE = 0.5;
const INTEREST_RATE = 0.07;

export function calculateStateSupport(monthlyPayment: number): number {
  const support = SUBSIDY_RATE * monthlyPayment;
  return round(Math.min(support, MAX_GOV_SUPPORT), 2);
}
export function calculateInvestmentIncome(firstDeposit: number, monthlyPayment: number): number {
  const annualPayment = monthlyPayment * 12;
  const adjustedPayment = Math.min(firstDeposit, monthlyPayment * SUBSIDY_RATE * 12);
  return round(
    ((annualPayment + adjustedPayment + firstDeposit) * (Math.pow(1 + INTEREST_RATE, INVEST_DURATION) - 1)) /
      (INTEREST_RATE * 2),
    2,
  );
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomDocNumber(): string {
  const part1 = randomInt(10, 99); // 2 цифры
  const part2 = randomInt(10, 99); // 2 цифры
  const part3 = randomInt(10, 99); // 2 цифры

  return `800 ${part1}-${part2}-${part3}`;
}
export function randomOtpCode(): string {
  return `${randomInt(1000, 9999)}`;
}
export function randomEmailRu(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const length = randomInt(6, 12);

  let localPart = '';
  for (let i = 0; i < length; i++) {
    localPart += chars[randomInt(0, chars.length - 1)];
  }

  return `${localPart}@mail.ru`;
}
