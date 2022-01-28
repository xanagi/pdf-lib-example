import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

const extract = async (pdf: PDFDocument, indices: number[]): Promise<PDFDocument> => {
  const pdfDoc = await PDFDocument.create();
  // 指定したページをコピーする.
  const pages = await pdfDoc.copyPages(pdf, indices);
  pages.forEach((page) => {
    pdfDoc.addPage(page);
  });
  return pdfDoc;
}

const extract2 = async (pdf: PDFDocument, indices: number[]): Promise<PDFDocument> => {
  // 指定したページ以外を削除する.
  const pageCount = pdf.getPageCount();
  pdf.getPages().reverse().forEach((page, reverseIndex) => {
    const index = pageCount - 1 - reverseIndex;
    if (!indices.includes(index)) pdf.removePage(index);
  })
  return pdf;
}

const main =  async () => {
  const srcPath = './pdf/no15.pdf';
  const destPath = './output/extract.pdf';
  
  const start = Date.now();
  const data = fs.readFileSync(srcPath);
  const pdf = await PDFDocument.load(data);
  const destPdf = await extract2(pdf, [1]); // 2 ページ目を抜き出す
  const destData = await destPdf.save(); 
  fs.writeFileSync(destPath, destData); 
  const finish = Date.now();
  
  console.log(`PDF file (${destPath}) is generated in ${finish - start} ms`);
}

main();