const pdfjslib = require('pdfjs-dist');
const path = require('path');//lib para percorrer diretorios

//Worker do PDFJS, sem ele, nada funciona... tem que configurar la no webpack depois
pdfjslib.GlobalWorkerOptions.workerSrc = path.resolve(__dirname, '../../dist/pdf.worker.bundle.js')//necessario para rodar a lib PDF JS

export class DocumentPreviewController {
  constructor(file){
    this._file = file;
  }

  getPreviewData() {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      switch(this._file.type) {
        case 'image/png':
        case 'image/jpeg':
        case 'image/jpg':
        case 'image/gif':

        reader.onload = e => {
          resolve({
            src: reader.result,
            info: this._file.name
          });
        }
        reader.onerror = e => {
          reject(e)
        }
        reader.readAsDataURL(this._file);

        break;

        case 'application/pdf':
        reader.onload = e => {
          //faz a conversar de arraybuffer para array de 8bits que é oque ele consegue ler
          pdfjslib.getDocument(new Uint8Array(reader.result)).then(pdf => {
            pdf.getPage(1).then(page => {//pega a primeira pagina do arquivo PDF e traz as infos
              let viewport = page.getViewport(1);//pega a imagem da pagina 1
              let canvas = document.createElement('canvas');
              let canvasContext = canvas.getContext('2d')

              canvas.width = viewport.width;
              canvas.height = viewport.height;

              page.render({
                canvasContext,
                viewport
              }).then(() => {
                let s = (pdf.numPages > 1) ? 's' : '';

                resolve({
                  src: canvas.toDataURL('image/png'),
                  info: `${pdf.numPages} página${s}`
                })
              }).catch(err => {
                reject(err)
              })

            }).catch(err => {
              reject(err)
            })
          }).catch(err => {
            reject(err);
          }) ;
        }
        reader.readAsArrayBuffer(this._file)

        break;

        default:
        reject();
      };
    })

  }
}