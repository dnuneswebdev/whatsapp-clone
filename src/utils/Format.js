export class Format {
  
  static getCamelCase(elementId) {//metodo estático não precisa ser instanciado, ja pode chamar ele direto em qualquer lugar
    let div = document.createElement('div');//essa div foi criada só para gerar o data-set 

    div.innerHTML = `<div data-${elementId}="id"></div>`;//quando vai pro JS, automaticamente ja vira camelCase

    return Object.keys(div.firstChild.dataset)[0];//traz um aray com todas as chaves que ele encontrar em um objeto
  }

  static toTime(duration) {
    let seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60);
    let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    if(hours > 0) {
      return `${hours}:${minutes}:${seconds.toString().padStart(2, '0')}`;//faz com que os segundos comece com 00;
    }
    else  {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }

  static timeStampToTime(timeStamp) {
    return (timeStamp && typeof timeStamp.toDate === 'function') ? Format.dateTotime(timeStamp.toDate()) : '';
  }

  static dateTotime(date, locale = 'pt-BR') {
    return date.toLocaleTimeString(locale, {
      hours: '2-digit',
      minutes: '2-digit'
    })
  }

}