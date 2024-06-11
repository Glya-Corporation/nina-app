export default filterDate = (dates, today) => {
  const array = [];
  const [todayDay, todayMonth, todayYear] = today.split('-').map(Number);

  for (const { date, ...rest } of dates) {
    const [day, month, year] = date.split('-').map(Number);

    if (year > todayYear || (year === todayYear && (month > todayMonth || (month === todayMonth && day > todayDay)))) {
      array.push({ date, ...rest });
    }
  }
  
  array.sort((a, b) => {
    const [dayA, monthA, yearA] = a.date.split('-').map(Number);
    const [dayB, monthB, yearB] = b.date.split('-').map(Number);

    if (yearA !== yearB) return yearA - yearB;
    if (monthA !== monthB) return monthA - monthB;
    return dayA - dayB;
  });
  return array;
};
