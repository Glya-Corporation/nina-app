export default filterDate = (dates, today) => {
  const array = [];
  const [todayDay, todayMonth, todayYear] = today.split('-').map(Number);

  for (const { date, ...rest } of dates) {
    const [day, month, year] = date.split('-').map(Number);

    if (year > todayYear || (year === todayYear && (month > todayMonth || (month === todayMonth && day > todayDay)))) {
      array.push({ date, ...rest });
    }
  }

  return array;
};
