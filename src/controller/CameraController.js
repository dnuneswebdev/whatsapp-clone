class CameraController {
  constructor(videoEl) {//recebe o ID do elemento onde vai ser renderizado o video
    this._videoEl = videoEl;//passa pra variavel

    navigator.mediaDevices.getUserMedia({//faz a pergunta ao usuário se ele permite usar a camera
      video: true //qual a midia que queremos
    }).then(stream => {//retorna uma promessa e um stream
      this._videoEl.src = URL.createObjectURL(stream);//cria um URL para que o video consiga ler
      this._videoEl.play();
    }).catch(err => {
      console.error(err)
    })


  }



}