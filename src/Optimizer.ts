import { PDFDocument, PDFDict, PDFRef, PDFStream, PDFArray, PDFObject, PDFCatalog, PDFPageTree } from 'pdf-lib'

class Optimizer {
    pdfDoc: PDFDocument;
    refs: PDFRef[];
    checked: PDFObject[];
  
    constructor(pdfDoc: PDFDocument) {
      this.pdfDoc = pdfDoc;
      this.refs = [];
      this.checked = [];
    }
  
    optimize() {
      const refs: PDFRef[]  = [];
      for (const page of this.pdfDoc.getPages()) {
        this.addRefs(page.node, []);
      }
      // console.log(this.refs);
      const objectNumbers = this.refs.map((ref) => ref.objectNumber);
      console.log(objectNumbers);
  
      for (const [ref, obj] of this.pdfDoc.context.enumerateIndirectObjects()) {
        // console.log(ref, obj.constructor.name);
        if (!objectNumbers.includes(ref.objectNumber)) {
          if (obj instanceof PDFPageTree || obj instanceof PDFCatalog) continue; 
          this.pdfDoc.context.delete(ref);
        }
      }
    }
  
    addRef(obj: PDFObject, context: PDFObject[]) {
      if (obj instanceof PDFRef) {
        if (!this.refs.includes(obj)) {
          console.log(obj);
          this.refs.push(obj);
        }
        const subject = this.pdfDoc.context.lookup(obj);
        if (subject) this.addRefs(subject, context);
      } else {
        this.addRefs(obj, context);
      }
    }
  
    addRefs(obj: PDFObject, context: PDFObject[]) {
      // console.log('obj', obj.constructor.name);
      if (this.checked.includes(obj)) {
        return;
      } else {
        this.checked.push(obj);
      }
  
      if (obj instanceof PDFPageTree || obj instanceof PDFCatalog) return; 
  
      if (obj instanceof PDFDict) {
        const dict = obj as PDFDict;
        for (const value of dict.values()) {
          this.addRef(value, context);
        }
      } else if (obj instanceof PDFArray) {
        const array = obj as PDFArray;
        for (const value of array.asArray()) {
          this.addRef(value, context);
        }
      } else if (obj instanceof PDFStream) {
        const stream = obj as PDFStream;
        if (stream.sizeInBytes() > 200000) {
          console.log(stream.sizeInBytes());
        }
        for (const value of stream.dict.values()) {
          this.addRef(value, context);
        }
      }
    }
  }

  export default Optimizer;