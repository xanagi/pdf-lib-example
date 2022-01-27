import fs from 'fs';
import { PDFDocument } from 'pdf-lib'

const extract = async (pdf: PDFDocument, indices: number[]): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  // 指定したページをコピーする.
  const pages = await pdfDoc.copyPages(pdf, indices);
  pages.forEach((page) => {
    pdfDoc.addPage(page);
  });
  return pdfDoc;
}

const main =  async () => {
  const pdf = await PDFDocument.load(fs.readFileSync('./pdf/no15.pdf'));
  const destPath = './output/extract.pdf';

  fs.writeFileSync(destPath, await (await extract(pdf, [1])).save()); // 2 ページ目を抜き出す
  console.log(`PDF file (${destPath}) is generated`);
}

main();