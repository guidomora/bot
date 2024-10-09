export const createOneDay = () => {
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const daysOfWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const today = new Date()
  const dayName = daysOfWeek[today.getDay()]
  const dayNumber = today.getDate()
  const monthName = months[today.getMonth()]
  

  const day = `${dayName} ${dayNumber} ${monthName}`
  console.log(day);
  return day
}




// ------------------------- 14 days-------------------------------
export const createDaysForTwoWeeks = () => {

  const closedDay = "domingo" // XXXXX

  const days = [];
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const daysOfWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  for (let i = 0; i < 14; i++) {
    const day = new Date();

    day.setDate(day.getDate() + i);  // Añade i días al día actual

    const dayName = daysOfWeek[day.getDay()];

    // Salteamos el dia que esta cerrado
    if (dayName === closedDay) {
      continue;
    }


    const dayOfMonth = day.getDate();
    const month = months[day.getMonth()];
    const formattedDay = `${dayName} ${dayOfMonth} ${month}`;
    days.push(formattedDay);
  }

  return days;
};


export const repeatDay = () => {
  const days: string[][] = [];
  const scheduleList: string[] = ["", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", ""];
  const twoWeeksDays: string[] = createDaysForTwoWeeks();

  // Llenamos el array con los días y el horario para cada fila
  twoWeeksDays.forEach(day => {
    scheduleList.forEach(schedule => {
      if (schedule == "") {
        days.push(["", schedule]);
      } else days.push([day, schedule]);
    });
  })

  return days
};
// ------------------------- 14 days-------------------------------

export const getNextDate = async (date: string) => {
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const daysOfWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];

  // Extraer el día y el mes de la fecha recibida
  const [onlyDay, dayNumber, monthName] = date.split(" ");

  // Crear un objeto Date con la fecha recibida
  const monthIndex = months.findIndex(month => month === monthName);

  if (monthIndex === -1) {
    throw new Error('Mes no válido');
  }

  const currentDate = new Date(new Date().getFullYear(), monthIndex, parseInt(dayNumber));

  // Sumar un día a la fecha
  do {
    currentDate.setDate(currentDate.getDate() + 1);
  } while (daysOfWeek[currentDate.getDay()] === "domingo"); // Salta si es domingo

  // Obtener el nuevo día y mes
  const newDay = daysOfWeek[currentDate.getDay()]; // Nuevo día de la semana
  const newDayNumber = currentDate.getDate(); // Nuevo número de día
  const newMonthName = months[currentDate.getMonth()]; // Nuevo mes


  return `${newDay} ${newDayNumber} ${newMonthName}`; // Devolver la fecha en el formato deseado
};


export const repeatDayNew = async (date: string) => {
  const day = await getNextDate(date)
  const days: string[][] = [];
  const scheduleList: string[] = ["", "", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", ""];

  // Llenamos el array con los días y el horario para cada fila
  scheduleList.forEach(schedule => {
    if (schedule == '') {
      days.push(["", schedule])
    } else days.push([day, schedule]);
  })



  return days
};

