class Format {
  
  static getCamelCase(id) {//metodo estático não precisa ser instanciado, ja pode chamar ele direto em qualquer lugar
    let div = document.createElement('div');//essa div foi criada só para gerar o data-set 

    div.innerHTML = `<div data-${id}="id"></div>`;//quando vai pro JS, automaticamente ja vira camelCase

    return Object.keys(div.firstChild.dataset)[0];//traz um aray com todas as chaves que ele encontrar em um objeto
  }

}