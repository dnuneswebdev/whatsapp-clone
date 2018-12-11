
export class ClassEvent {
  constructor() {
    this._events = {};
    //ficaria mais ou menos assim:
    /*
    this._events = {
      play: [//array de funções
        () => {console.log('A')},
        () => {console.log('B')}
      ]
    }
    */
  }

  on(eventName, fn) {
    if(!this._events[eventName]) {//verifica se o evento ja foi criado dentro do objeto _events{}
      this._events[eventName] = new Array();//cria um array de um evento novo que pode receber varias funções diferentes
    }

    this._events[eventName].push(fn);//joga a função dentro da chave correspondente, podem ser varias diferentes
    
  }

  trigger() {
    let args = [...arguments]//arguments é nativo do JS, pega todo argumento que ta vindo, mesmo que não declarado
                             //unica regra, é que o primeiro argumento, tem que ser o nome do evento
    let eventName = args.shift();//pega o primeiro valor do array pois sempre sera o nome do evento, o resto sao as funçoes

    args.push(new Event(eventName))

    if(this._events[eventName] instanceof Array) {
      this._events[eventName].forEach(fn => {
          fn.apply(null, args);//faz com que a função aconteça.... executa oque foi passado aqui
      });
    }
  }
}