const path = require('path')


module.exports = {
  entry: {
    app: './src/app.js',
    'pdf.worker': 'pdfjs-dist/build/pdf.worker.entry.js'//path do worker pdf
  },
  output: {
    filename: '[name].bundle.js',//name vem das chaves ENTRY ali de cima (app e pdf.worker)
    path: path.join(__dirname, 'dist'),//com pdfworker
    // path: path.resolve(__dirname, '/dist'),//padrão, sem pdf worker
    publicPath: 'dist'
  }
}