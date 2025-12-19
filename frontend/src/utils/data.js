export function formatDate(date) {
  return date.toISOString().split("T")[0];
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function getWeekRange(centerDate) {
  const from = addDays(centerDate, -3);
  const to = addDays(centerDate, 3);

  return {
    from: formatDate(from),
    to: formatDate(to),
  };
}