import * as XLSX from 'xlsx';
import { DataSource } from '../core/interfaces';

export class ExcelSource implements DataSource {
  constructor(private file: Express.Multer.File) {}

  async load(): Promise<any[]> {
    const workbook = XLSX.read(this.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    return XLSX.utils.sheet_to_json(sheet);
  }
}
