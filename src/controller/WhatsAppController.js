class WhatsAppController {
  constructor() {
    


    this.loadElements();
  }

  loadElements() {
    this.el = {};//objeto vazio que sera alimentado com todos os elementos que tenham ID do html

    document.querySelectorAll('[id]').forEach(element => {//seleciona todos os ID do arquivo html
      this.el[Format.getCamelCase(element.id)] = element;
    });
  }






}