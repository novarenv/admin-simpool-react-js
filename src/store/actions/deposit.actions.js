export const DEPOSIT = 'DEPOSIT';

export function deposit(payload) {
  return { type: DEPOSIT, payload };
}