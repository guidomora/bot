

// export const createDay = () => {
//     const day = new Date();
//     const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
//     const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
//     const dayName = daysOfWeek[day.getDay()];
//     const dayOfMonth = day.getDate();
//     const month = months[day.getMonth()]
//     const formattedDay = `${dayName} ${dayOfMonth} ${month}`;
//     return formattedDay;
// }


// export const repeatDay = () => {
//     const days = [];
//     const day = createDay();
//     const scheduleList = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];

//     // Llenamos el array con el día y el horario para cada fila
//     for (let i = 0; i < scheduleList.length; i++) {
//         days.push([day, scheduleList[i]]);
//     }

//     return days;
// }


// export const schedules = () => {
//     const scheduleList = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
//     return scheduleList.map((schedule) => schedule)
// }

// ------------------------- 14 days-------------------------------
export const createDaysForTwoWeeks = () => {
  const days = [];
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  for (let i = 0; i < 14; i++) {
    const day = new Date();

    day.setDate(day.getDate() + i);  // Añade i días al día actual

    const dayName = daysOfWeek[day.getDay()];
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
// --------------------------------------------

// export const createDay = () => {

//   const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
//   const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

//     const day = new Date();
//     console.log(day);
    
//     day.setDate(day.getDate() + 1);

//     const dayName = daysOfWeek[day.getDay()];
//     const dayOfMonth = day.getDate();
//     const month = months[day.getMonth()];
//     const formattedDay = `${dayName} ${dayOfMonth} ${month}`;
  
//   return [formattedDay];
// };


// export const repeatDayNew = () => {
//   const days: string[][] = [];
//   const scheduleList: string[] = ["", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", ""];
//   const twoWeeksDays: string[] = createDay();

//   // Llenamos el array con los días y el horario para cada fila
//   twoWeeksDays.forEach(day => {
//     scheduleList.forEach(schedule => {
//       if (schedule == "") {
//         days.push(["", schedule]);
//       } else days.push([day, schedule]);
//     });
//   });

  
//   return days
// };

export const getNextDate = async (date: string) => {
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  const daysOfWeek = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  // Extraer el día y el mes de la fecha recibida
  const [onlyDay, dayNumber, monthName] = date.split(" ");
  
  // Crear un objeto Date con la fecha recibida
  const monthIndex = months.findIndex(month => month === monthName);
  
  if (monthIndex === -1) {
    throw new Error('Mes no válido');
  }

  const currentDate = new Date(new Date().getFullYear(), monthIndex, parseInt(dayNumber));
  
  // Sumar un día a la fecha
  currentDate.setDate(currentDate.getDate() + 1);
  
  // Obtener el nuevo día y mes
  const newDay = daysOfWeek[currentDate.getDay()]; // Nuevo día de la semana
  const newDayNumber = currentDate.getDate(); // Nuevo número de día
  const newMonthName = months[currentDate.getMonth()]; // Nuevo mes
  
  return `${newDay} ${newDayNumber} ${newMonthName}`; // Devolver la fecha en el formato deseado
};
