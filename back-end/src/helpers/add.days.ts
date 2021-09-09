export function addDays(date: Date, days: number) {
  date.setDate(date.getDate() + Number(days));
  return date;
}
