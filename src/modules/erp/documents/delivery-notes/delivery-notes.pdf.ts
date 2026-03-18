import * as PdfPrinter from 'pdfmake';
import { readFileSync } from 'fs';
import { resolve } from 'path';

export function generateDeliveryNotePdf(note: any): Promise<Buffer> {
  const logoPath = resolve(process.cwd(), 'public', 'logo.png');
  const logoBase64 = readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const items = note.picking_orders?.[0]?.picking_items ?? [];

  const docDefinition = {
    // ... todo el docDefinition de antes
  };

  const fonts = {
    Roboto: {
      normal: resolve('node_modules/pdfmake/build/vfs_fonts.js'),
      bold: resolve('node_modules/pdfmake/build/vfs_fonts.js'),
      italics: resolve('node_modules/pdfmake/build/vfs_fonts.js'),
      bolditalics: resolve('node_modules/pdfmake/build/vfs_fonts.js'),
    },
  };

  const printer = new PdfPrinter(fonts);
  const pdfDoc = printer.createPdfKitDocument(docDefinition as any);

  return new Promise((res, rej) => {
    const chunks: Buffer[] = [];
    pdfDoc.on('data', (chunk) => chunks.push(chunk));
    pdfDoc.on('end', () => res(Buffer.concat(chunks)));
    pdfDoc.on('error', rej);
    pdfDoc.end();
  });
}
