import { envs } from "../../config/envs";
import { google } from 'googleapis';
import auth from '../../data/sheetsConnection';
import { repeatDayNew } from "../../helpers/helpers";

const sheetId = envs.SPREADSHEET_ID

// gets the last row value and adds a new day
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

        const lastRowValue = rows[0][rows[0].length - 1];



        // Sumar un día a la fecha obtenid
        const dayAndTimetable = await repeatDayNew(lastRowValue)


        await appendRow(dayAndTimetable)


        return `${dayAndTimetable[2]} agregado`
    } catch (error) {
        console.error('Error al obtener el último valor de la fila:', error);
        throw error;
    }
}

// adds a new day
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
        return response
    } catch (error) {
        console.error('Error al agregar un nuevo día a la hoja:', error);
        throw error;
    }
}





// ads 14 days from the actual day
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