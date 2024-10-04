import { google } from 'googleapis';
import auth from '../data/sheetsConnection';
import { getNextDate, repeatDayNew } from '../helpers/helpers';
import { envs } from '../config/envs';


const sheetId = envs.SPREADSHEET_ID

export async function getLastRowValue() {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = '1bYiO91voc2Zh0foa9oSFB54n5AUyqjShVBxO-V6eFUg'; // ID de la hoja de cálculo
  const range = 'Sheet1!A:A'; // Columna A completa (solo para obtener el total de filas)

  try {
    // Obtener la última fila de la columna A usando una opción que solo devuelva los valores que necesitamos
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
      majorDimension: 'COLUMNS', // Devuelve los valores por columna
    });

    const rows = response.data.values || [];

    if (rows.length === 0 || rows[0].length === 0) {
      // Si no hay filas o columnas con datos
      console.log('No hay datos en la columna.');
      return null;
    }

    const lastRowValue = rows[0][rows[0].length - 1];
    console.log(rows[0][rows[0].length - 1]);


    // Sumar un día a la fecha obtenid
    const dayAndTimetable = await repeatDayNew(lastRowValue)


    await appendRow(dayAndTimetable)

  } catch (error) {
    console.error('Error al obtener el último valor de la fila:', error);
    throw error;
  }
}

async function appendRow(newDate: string[][]) {

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId; // ID de la hoja de cálculo
  const range = 'Sheet1!A:A'; // Columna A para agregar un nuevo valor

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW', // Usa 'USER_ENTERED' si deseas que Google Sheets interprete la entrada
      requestBody: {
        values: newDate,
      },
    });
    console.log('Nuevo día agregado:', response.data.updates!.updatedRange);
  } catch (error) {
    console.error('Error al agregar un nuevo día a la hoja:', error);
    throw error;
  }
}






export async function writeToSheet(values: any) {
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = sheetId
  const startRow = 3; // Empezamos desde la fila 3, como en tu ejemplo
  const endRow = startRow + values.length - 1; // Calculamos el número final de filas
  const range = `Sheet1!A${startRow}:B${endRow}`; // Rango dinámico
  const valueInputOption = 'USER_ENTERED'
  const requestBody = { values };

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody,
    });

    // Solo devuelve los valores que se han escrito
    return values;
  } catch (error) {
    console.log(error);
  }
}
// ---------- Clients and services -----------------

// gets the row number with the date and time, and ads the customer and service
export async function readSheet(date: string, time: string) {
  // TODO: ver tema de la hora, si habria que hacer algo para que solo se ponga el numero (14) en vez de ej 14:00
  // o que si solo recibe el numero, le agregue los 00 ---------- 

  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId;
  const range = 'Sheet1!A:B';

  try {
    // Obtener los valores de las columnas A y B
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
      if (dateInSheet === date.toLowerCase() && timeInSheet === time) {
        const dataNumber = i + 1
        // Sumar 1 porque las filas en Google Sheets comienzan en 1
        // console.log(dataNumber);

        // TODO: hacerlo dinamico
        const test = ["roberto", 'corte de pelo']
        const agregado = await addClientService(dataNumber, [test])
        return agregado
      }
    }

    console.log('No se encontró una fila que coincida con la fecha y hora.');
    return null;
  } catch (error) {
    console.error('Error al obtener el número de fila:', error);
    throw error;
  }
}



// agrega un cliente y un servicio a las columnas
export async function addClientService(rowNumber: number, values: string[][]) {
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = sheetId
  const startRow = rowNumber;
  const range = `Sheet1!C${startRow}:D${startRow}`; // Rango dinámico
  const valueInputOption = 'USER_ENTERED'
  const requestBody = { values }

  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption,
      requestBody
    });

    return requestBody;
  } catch (error) {
    console.log(error);
  }
}
