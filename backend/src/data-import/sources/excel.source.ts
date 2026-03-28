import { DataSource } from '../core/interfaces';
import * as XLSX from 'xlsx';

export class ExcelSource implements DataSource {
  constructor(private file: Express.Multer.File) {}

  async load(): Promise<unknown[]> {
    const workbook = XLSX.read(this.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    // Convertir a JSON (asume que la primera fila son headers)
    const data = XLSX.utils.sheet_to_json(worksheet);

    return data;
  }
}
