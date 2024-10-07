import { envs } from "../../config/envs";
import { google } from 'googleapis';
import auth from '../../data/sheetsConnection';


const sheetId = envs.SPREADSHEET_ID

// ADD

// gets the row number with the date and time, and ads the customer and service
export async function addReservation(date: string, time: string, customer:string, service:string) {

    // TODO: ver tema de la hora, si habria que hacer algo para que solo se ponga el numero (14) en vez de ej 14:00
    // o que si solo recibe el numero, le agregue los 00 ---------- 
  
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = sheetId;
    const range = 'Sheet1!A:B';
  
    try {
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
          const dataNumber = i + 1
          // Sumar 1 porque las filas en Google Sheets comienzan en 1
  
          const test = [customer, service]
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
  
  
  
  // ads a client and a service at the row number
  export async function addClientService(rowNumber: number, values: string[][]) {
    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = sheetId
    const startRow = rowNumber;
    const range = `Sheet1!C${startRow}:D${startRow}`;
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
  
  // READ
  
  // Gets the rows and ALL the reservations
  export async function getReservationsRows () {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = sheetId;
    const range = 'Sheet1!C:D';
  
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        majorDimension: 'ROWS',
      });
  
      const rows = response.data.values || [];
      const nextReservations:number[] =[] // rows wth reservations
      
      // starts at 1 because row 1 has the col name
      for (let i = 1; i < rows.length; i++){
        if (rows[i].length > 1) {
          nextReservations.push(i+1)
        }
      }
      
  
      return getAllReservations(nextReservations);
    } catch (error) {
      console.error('Error al obtener el número de fila:', error);
      throw error;
    }
  }
  
  // gets the row content
  export async function getAllReservations(rowsNumbers:number[]) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = sheetId;
    
    try {
      const rowContent:string[][] = []
  
      for (const rowNumber of rowsNumbers ) {
        const range = `Sheet1!A${rowNumber}:D${rowNumber}`
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
          majorDimension:'ROWS'
        })
        const row:string[][] = res.data.values || [];
        if (row.length > 0) {
          rowContent.push(row[0]);  // Añadir la fila al array de resultados
        }
      }
      return rowContent
    } catch (error) {
      console.error('Error al obtener el contenido de las filas:', error);
      throw error;
    }
  }
  
  
  // You can get the free hours on the selected date
  export async function getFreeHoursDay(date: string) {
  
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = sheetId;
    const range = 'Sheet1!A:B';
    let freeHours:string[][] = []
  
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
        majorDimension: 'ROWS',
      });
  
      const rows = response.data.values || [];
  
      // Recorrer las filas y comparar los valores de la columna A y B
      for (let i = 0; i < rows.length; i++) {
        const [dateInSheet] = rows[i];
  
        // Verificar si la fecha coincide
        if (dateInSheet === date) {
          const dataNumber = i + 1;
  
          // Obtener las filas que coinciden con la fecha y que no tienen cliente asignado
          const free = await getFreeHoursRow([dataNumber]);
  
          // Filtrar solo las filas que no están vacías
          if (free.length > 0 && free[0].length > 0) {
            freeHours = freeHours.concat(free);
          }
        }
      }
  
      if (freeHours.length === 0) {
        console.log('No se encontraron horarios libres para esa fecha.');
      }
  
      
      return freeHours;
    } catch (error) {
      console.error('Error al obtener el número de fila:', error);
      throw error;
    }
  }
  
  // With que row number gets the hours that are free
  export async function getFreeHoursRow(rowsNumbers:number[]) {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = sheetId;
    
    try {
      const rowContent:string[][] = []
  
      for (const rowNumber of rowsNumbers ) {
        const range = `Sheet1!A${rowNumber}:D${rowNumber}`
        const res = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range,
          majorDimension:'ROWS'
        })
        const row:string[][] = res.data.values || [];
        
        if (row[0][2] == undefined && row.length > 0)  {
          rowContent.push(row[0]);  // Añadir la fila al array de resultados
        }
      }
      return rowContent
    } catch (error) {
      console.error('Error al obtener el contenido de las filas:', error);
      throw error;
    }
  }