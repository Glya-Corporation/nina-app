export default filterDate = (dates, today) => {
  const array = [];
  const [todayMonth, todayDay, todayYear] = today.split('-').map(Number);

  for (const { date, ...rest } of dates) {
    const [month, day, year] = date.split('-').map(Number);

    if (year > todayYear || (year === todayYear && (month > todayMonth || (month === todayMonth && day > todayDay)))) {
      array.push({ date, ...rest });
    }
  }

  return array;
};

/*const filterDate = (date, today) => {
  const array = [];

  for (let i = 0; i < date.length; i++) {
    console.log(Number(date[i].date.split('-')[0]), Number(today.split('-')[0]));
    if (
      (Number(date[i].date.split('-')[0]) > Number(today.split('-')[0]) && Number(date[i].date.split('-')[1]) > Number(today.split('-')[1])) ||
      (Number(date[i].date.split('-')[1]) > Number(today.split('-')[1]))
    ) {
      array.push(date[i]);
    }
  }

  return array;
};

const array = [
  { id: 1, date: '08-06-2024', name: 'Luis' },
  { id: 2, date: '09-06-2024', name: 'Luis' },
  { id: 3, date: '10-06-2024', name: 'Luis' },
  { id: 4, date: '08-07-2024', name: 'Luis' },
  { id: 5, date: '11-07-2024', name: 'Luis' }
];

console.log(filterDate(array, '09-06-2024'));
 */
