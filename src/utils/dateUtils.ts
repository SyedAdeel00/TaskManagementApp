// utils/DateUtils.ts
export const isFutureDate = (date: string): boolean => {
  const today = new Date();
  const inputDate = new Date(date);
  return inputDate > today;
};
