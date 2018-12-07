export class CameraController {
  constructor(videoEl) {//recebe o ID do elemento onde vai ser renderizado o video
    this._videoEl = videoEl;//passa pra variavel

    navigator.mediaDevices.getUserMedia({//faz a pergunta ao usuário se ele permite usar a camera
      video: true //qual a midia que queremos
    }).then(stream => {//retorna uma promessa e um stream
      this._stream = stream;

      this._videoEl.src = URL.createObjectURL(stream);//cria um URL para que o video consiga ler
      this._videoEl.play();
    }).catch(err => {
      console.error(err)
    });
  }

  stop() {//metodo para desligar a camera
    this._stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  // --------------------------------------------------
  // TAKE PICTURE
  // --------------------------------------------------
  takePicture(mimeType ='image/png') {
    let canvas = document.createElement('canvas');
    
    canvas.setAttribute('height', this._videoEl.videoHeight);
    canvas.setAttribute('width', this._videoEl.videoWidth);

    let context = canvas.getContext('2d');

    context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

    return canvas.toDataURL(mimeType)
  }

}