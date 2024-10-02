import { google } from 'googleapis';
import auth from '../data/sheetsConnection';
import { getNextDate } from '../helpers/helpers';
import { envs } from '../config/envs';


const sheetId = envs.SPREADSHEET_ID

export async function getLastRowValue() {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId; // ID de la hoja de cálculo
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

    // TODO:
    // hacer que agregue el rango de horarios y se repita ese dia
    const lastRowValue = rows[0][rows[0].length - 1];
    console.log(lastRowValue);


    // Sumar un día a la fecha obtenida
    const newDate = await getNextDate(lastRowValue);

    await appendRow(newDate)

    return lastRowValue;
  } catch (error) {
    console.error('Error al obtener el último valor de la fila:', error);
    throw error;
  }
}

async function appendRow(newDate: string) {
  const sheets = google.sheets({ version: 'v4', auth });
  const spreadsheetId = sheetId; // ID de la hoja de cálculo
  const range = 'Sheet1!A:A'; // Columna A para agregar un nuevo valor

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW', // Usa 'USER_ENTERED' si deseas que Google Sheets interprete la entrada
      requestBody: {
        values: [[""],[""],[newDate]], // Formato de los datos a agregar
      },
    });
    console.log('Nuevo día agregado:', response.data.updates!.updatedRange);
  } catch (error) {
    console.error('Error al agregar un nuevo día a la hoja:', error);
    throw error;
  }
}



export async function readSheet() {
  const sheets = google.sheets({ version: 'v4', auth })
  const spreadsheetId = sheetId
  const startRow = 3;
  const range = `Sheet1!A${startRow}:A`; // Solo la columna A

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range
    })
    const existingDates = response.data.values || []
    return existingDates.map(row => row[0]);
  } catch (error) {
    console.log('Error al obtener las fechas:', error);
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
