import fs from 'fs';
import { PDFDocument } from 'pdf-lib'

const merge = async (pdfs: PDFDocument[]): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  // 1ページずつコピーコピーする.
  for (const pdf of pdfs) {
    const pages = await pdfDoc.copyPages(pdf, pdf.getPageIndices());
    pages.forEach((page) => {
      pdfDoc.addPage(page);
    });
  }
  return pdfDoc;
}

const main =  async () => {
  const pdfs = [
    await PDFDocument.load(fs.readFileSync('./pdf/hayami.pdf')),
    await PDFDocument.load(fs.readFileSync('./pdf/no15.pdf')),
  ]
  const destPath = './output/merge.pdf';

  fs.writeFileSync(destPath, await (await merge(pdfs)).save());
  console.log(`PDF file (${destPath}) is generated`);
}

main();
