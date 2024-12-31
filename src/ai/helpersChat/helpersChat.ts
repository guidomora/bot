// TODO: Chequear si funcionan

export const getExpressionToday = () => {
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const daysOfWeek = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
    const today = new Date()
    today.setDate(today.getDate());
    const dayName = daysOfWeek[today.getDay()]
    const dayNumber = today.getDate()
    const monthName = months[today.getMonth()]
    const formattedDay = today.toLocaleDateString()
  
    const day = `${dayName} ${dayNumber} ${monthName} ${formattedDay}`
    console.log(day);
    return day
}


export const getExpressionTomorrow = async (date: string) => {
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
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  
    console.log(`${newDay} ${newDayNumber} ${newMonthName} ${formattedDate}`);
    
    return `${newDay} ${newDayNumber} ${newMonthName} ${formattedDate}`; // Devolver la fecha en el formato deseado
  };