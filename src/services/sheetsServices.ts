// import { google } from 'googleapis';
// import auth from '../data/sheetsConnection';
// import { getNextDate, repeatDayNew } from '../helpers/helpers';
// import { envs } from '../config/envs';


// const sheetId = envs.SPREADSHEET_ID

// // gets the last row value and adds a new day
// export async function getLastRowValue() {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId; // ID de la hoja de cálculo
//   const range = 'Sheet1!A:A'; // Columna A completa (solo para obtener el total de filas)

//   try {
//     // Obtener la última fila de la columna A usando una opción que solo devuelva los valores que necesitamos
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//       majorDimension: 'COLUMNS', // Devuelve los valores por columna
//     });

//     const rows = response.data.values || [];

//     if (rows.length === 0 || rows[0].length === 0) {
//       // Si no hay filas o columnas con datos
//       console.log('No hay datos en la columna.');
//       return null;
//     }

//     const lastRowValue = rows[0][rows[0].length - 1];
//     console.log(rows[0][rows[0].length - 1]);


//     // Sumar un día a la fecha obtenid
//     const dayAndTimetable = await repeatDayNew(lastRowValue)


//     await appendRow(dayAndTimetable)

//   } catch (error) {
//     console.error('Error al obtener el último valor de la fila:', error);
//     throw error;
//   }
// }

// // adds a new day
// async function appendRow(newDate: string[][]) {

//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId; // ID de la hoja de cálculo
//   const range = 'Sheet1!A:A'; // Columna A para agregar un nuevo valor

//   try {
//     const response = await sheets.spreadsheets.values.append({
//       spreadsheetId,
//       range,
//       valueInputOption: 'RAW', // Usa 'USER_ENTERED' si deseas que Google Sheets interprete la entrada
//       requestBody: {
//         values: newDate,
//       },
//     });
//     return response
//   } catch (error) {
//     console.error('Error al agregar un nuevo día a la hoja:', error);
//     throw error;
//   }
// }





// // ads 14 days from the actual day
// export async function writeToSheet(values: any) {
//   const sheets = google.sheets({ version: 'v4', auth })
//   const spreadsheetId = sheetId
//   const startRow = 3; // Empezamos desde la fila 3, como en tu ejemplo
//   const endRow = startRow + values.length - 1; // Calculamos el número final de filas
//   const range = `Sheet1!A${startRow}:B${endRow}`; // Rango dinámico
//   const valueInputOption = 'USER_ENTERED'
//   const requestBody = { values };

//   try {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range,
//       valueInputOption,
//       requestBody,
//     });

//     // Solo devuelve los valores que se han escrito
//     return values;
//   } catch (error) {
//     console.log(error);
//   }
// }


// ---------- Clients and services -----------------

// // ADD

// // gets the row number with the date and time, and ads the customer and service
// export async function addReservation(date: string, time: string, customer:string, service:string) {

//   // TODO: ver tema de la hora, si habria que hacer algo para que solo se ponga el numero (14) en vez de ej 14:00
//   // o que si solo recibe el numero, le agregue los 00 ---------- 

//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId;
//   const range = 'Sheet1!A:B';

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//       majorDimension: 'ROWS',
//     });

//     const rows = response.data.values || [];

//     // Recorrer las filas y comparar los valores de la columna A y B
//     for (let i = 0; i < rows.length; i++) {
//       const [dateInSheet, timeInSheet] = rows[i];

//       // Verificar si la fecha y hora coinciden
//       if (dateInSheet === date && timeInSheet === time) {
//         const dataNumber = i + 1
//         // Sumar 1 porque las filas en Google Sheets comienzan en 1

//         const test = [customer, service]
//         const agregado = await addClientService(dataNumber, [test])
//         return agregado
//       }
//     }

//     console.log('No se encontró una fila que coincida con la fecha y hora.');
//     return null;
//   } catch (error) {
//     console.error('Error al obtener el número de fila:', error);
//     throw error;
//   }
// }



// // ads a client and a service at the row number
// export async function addClientService(rowNumber: number, values: string[][]) {
//   const sheets = google.sheets({ version: 'v4', auth })
//   const spreadsheetId = sheetId
//   const startRow = rowNumber;
//   const range = `Sheet1!C${startRow}:D${startRow}`;
//   const valueInputOption = 'USER_ENTERED'
//   const requestBody = { values }

//   try {
//     await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range,
//       valueInputOption,
//       requestBody
//     });

//     return requestBody;
//   } catch (error) {
//     console.log(error);
//   }
// }

// // READ

// // Gets the rows and ALL the reservations
// export async function getReservationsRows () {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId;
//   const range = 'Sheet1!C:D';

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//       majorDimension: 'ROWS',
//     });

//     const rows = response.data.values || [];
//     const nextReservations:number[] =[] // rows wth reservations
    
//     // starts at 1 because row 1 has the col name
//     for (let i = 1; i < rows.length; i++){
//       if (rows[i].length > 1) {
//         nextReservations.push(i+1)
//       }
//     }
    

//     return getAllReservations(nextReservations);
//   } catch (error) {
//     console.error('Error al obtener el número de fila:', error);
//     throw error;
//   }
// }

// // gets the row content
// export async function getAllReservations(rowsNumbers:number[]) {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId;
  
//   try {
//     const rowContent:string[][] = []

//     for (const rowNumber of rowsNumbers ) {
//       const range = `Sheet1!A${rowNumber}:D${rowNumber}`
//       const res = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range,
//         majorDimension:'ROWS'
//       })
//       const row:string[][] = res.data.values || [];
//       if (row.length > 0) {
//         rowContent.push(row[0]);  // Añadir la fila al array de resultados
//       }
//     }
//     return rowContent
//   } catch (error) {
//     console.error('Error al obtener el contenido de las filas:', error);
//     throw error;
//   }
// }


// // You can get the free hours on the selected date
// export async function getFreeHoursDay(date: string) {

//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId;
//   const range = 'Sheet1!A:B';
//   let freeHours:string[][] = []

//   try {
//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId,
//       range,
//       majorDimension: 'ROWS',
//     });

//     const rows = response.data.values || [];

//     // Recorrer las filas y comparar los valores de la columna A y B
//     for (let i = 0; i < rows.length; i++) {
//       const [dateInSheet] = rows[i];

//       // Verificar si la fecha coincide
//       if (dateInSheet === date) {
//         const dataNumber = i + 1;

//         // Obtener las filas que coinciden con la fecha y que no tienen cliente asignado
//         const free = await getFreeHoursRow([dataNumber]);

//         // Filtrar solo las filas que no están vacías
//         if (free.length > 0 && free[0].length > 0) {
//           freeHours = freeHours.concat(free);
//         }
//       }
//     }

//     if (freeHours.length === 0) {
//       console.log('No se encontraron horarios libres para esa fecha.');
//     }

    
//     return freeHours;
//   } catch (error) {
//     console.error('Error al obtener el número de fila:', error);
//     throw error;
//   }
// }

// // With que row number gets the hours that are free
// export async function getFreeHoursRow(rowsNumbers:number[]) {
//   const sheets = google.sheets({ version: 'v4', auth });
//   const spreadsheetId = sheetId;
  
//   try {
//     const rowContent:string[][] = []

//     for (const rowNumber of rowsNumbers ) {
//       const range = `Sheet1!A${rowNumber}:D${rowNumber}`
//       const res = await sheets.spreadsheets.values.get({
//         spreadsheetId,
//         range,
//         majorDimension:'ROWS'
//       })
//       const row:string[][] = res.data.values || [];
      
//       if (row[0][2] == undefined && row.length > 0)  {
//         rowContent.push(row[0]);  // Añadir la fila al array de resultados
//       }
//     }
//     return rowContent
//   } catch (error) {
//     console.error('Error al obtener el contenido de las filas:', error);
//     throw error;
//   }
// }