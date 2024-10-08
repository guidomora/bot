import { envs } from "../../config/envs";
import { google } from 'googleapis';
import auth from '../../data/sheetsConnection';


const sheetId = envs.SPREADSHEET_ID

// POST

// gets the row number with the date and time, and ads the customer and service
// TODO: ver tema de la hora, si habria que hacer algo para que solo se ponga el numero (14) en vez de ej 14:00
export async function addReservation(date: string, time: string, customer: string, service: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId;
  const range = 'Sheet1!A:B';

  try {
    // Obtener todas las filas en las columnas A y B (fecha y hora)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension: 'ROWS',
    });

    const rows = response.data.values || [];

    // Recorrer las filas y comparar los valores de la columna A y B
    for (let i = 0; i < rows.length; i++) {
      const [dateInSheet, timeInSheet] = rows[i];

      // Verificar si la fecha y hora coinciden
      if (dateInSheet === date && timeInSheet === time) {
        const rowNumber = i + 1; // Google Sheets usa 1-based index

        // Crear una solicitud batchUpdate
        const batchUpdateRequest = {
          requests: [
            {
              updateCells: {
                range: {
                  sheetId: 0, // El ID de la hoja (puedes obtenerlo desde el sheetId)
                  startRowIndex: rowNumber - 1, // Ajustado para 0-based index
                  endRowIndex: rowNumber,
                  startColumnIndex: 2, // Columna C (A = 0, B = 1, C = 2)
                  endColumnIndex: 4 // Columna D
                },
                rows: [
                  {
                    values: [
                      { userEnteredValue: { stringValue: customer } }, // Cliente en columna C
                      { userEnteredValue: { stringValue: service } },  // Servicio en columna D
                    ]
                  }
                ],
                fields: 'userEnteredValue'
              }
            }
          ]
        };

        // Ejecutar la actualización en batch
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: batchUpdateRequest,
        });

        console.log(`Reserva añadida para ${date} a las ${time}: Cliente - ${customer}, Servicio - ${service}`);
        return { date, time, customer, service };
      }
    }

    console.log('No se encontró una fila que coincida con la fecha y hora.');
    return null;
  } catch (error) {
    console.error('Error al añadir la reserva:', error);
    throw error;
  }
}



// GET
  

// Get all the reservations in one request using batchGet
export async function getReservationsRows() {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId;
  const reservationRanges: string[] = [];
  
  try {
    // Get the rows from columns C and D
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Sheet1!C:D',
      majorDimension: 'ROWS',
    });

    const rows = response.data.values || [];

    // Find the rows that contain reservations (start from row 2, because row 1 has column names)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].length > 1) {
        const rowNumber = i + 1;
        reservationRanges.push(`Sheet1!A${rowNumber}:D${rowNumber}`);
      }
    }

    // If no reservations were found, return an empty array
    if (reservationRanges.length === 0) {
      return [];
    }

    // Use batchGet to get all reservation rows at once
    const batchResponse = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: reservationRanges,
      majorDimension: 'ROWS',
    });

    // Extract the reservation data
    const rowContent: string[][] = [];
    const batchRows = batchResponse.data.valueRanges || [];
    for (const range of batchRows) {
      const row = range.values || [];
      if (row.length > 0) {
        rowContent.push(row[0]);
      }
    }

    return rowContent;
  } catch (error) {
    console.error('Error al obtener todas las reservas:', error);
    throw error;
  }
}




  
  
 // Get free hours for the selected date
//  TODO: chequear si la fecha existe
export async function getFreeHoursDay(date: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId;
  const range = 'Sheet1!A:B'; // Column A has dates, B has times
  let freeHours: string[][] = [];

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension: 'ROWS',
    });

    const rows = response.data.values || [];
    const reservationRows: string[] = [];

    // Recorrer las filas y obtener los números de las filas que coinciden con la fecha
    for (let i = 0; i < rows.length; i++) {
      const [dateInSheet] = rows[i];

      // Verificar si la fecha coincide
      if (dateInSheet === date) {
        const dataNumber = i + 1; // Guardar el número de la fila (1-indexed)
        reservationRows.push(`Sheet1!A${dataNumber}:D${dataNumber}`); // Agregar rango para batchGet
      }
    }

    // Si no hay filas que coincidan con la fecha, devolver un array vacío
    if (reservationRows.length === 0) {
      console.log('No se encontraron horarios libres para esa fecha.');
      return [];
    }

    // Usar batchGet para obtener todas las filas que coinciden con la fecha
    const batchResponse = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: reservationRows,
      majorDimension: 'ROWS',
    });

    // Filtrar las filas para obtener las horas libres
    const batchRows = batchResponse.data.valueRanges || [];
    for (const range of batchRows) {
      const row = range.values || [];
      // Comprobar si la tercera columna está vacía (no hay cliente asignado)
      if (row.length > 0 && row[0][2] === undefined) {
        freeHours.push(row[0]); // Añadir la fila al array de horas libres
      }
    }

    
    if (freeHours.length === 0) {
      console.log('No se encontraron horarios libres para esa fecha.');
    }

    return freeHours;
  } catch (error) {
    console.error('Error al obtener horarios libres:', error);
    throw error;
  }
}
