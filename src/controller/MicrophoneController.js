import { ClassEvent } from "../utils/ClassEvent";

export class MicrophoneController extends ClassEvent{//herança, traz os atributos e metodos da outra class, estão ligadas
  constructor() {

    super();//chama o constructor do ClassEvent, sendo chamado apos o constructor do micropohneCOntroller, não correndo o risco de sobreescrever (super chama o constructor do pai (ClassEvent))

    this._available = false;//serve para proteger a gravação e o play do audio caso o usuario nao permita
    this._mimeType = 'audio/webm'

    navigator.mediaDevices.getUserMedia({//faz a pergunta ao usuário se ele permite usar a camera
      audio: true //qual a midia que queremos (audio)
    }).then(stream => {//retorna uma promessa e um stream
      this._available = true;
      this._stream = stream;
  
      this.trigger('ready', this._stream)

    }).catch(err => {
      console.error(err)
    });
    
  }

  stop() {//metodo para desligar o audio
    this._stream.getTracks().forEach(track => {
      track.stop();
    });
  }

  isAvailable() {
    return this._available
  }

  startRecorder() {
    if(this.isAvailable()) {
      this._mediaRecorder = new MediaRecorder(this._stream, {
        mimeType: this._mimeType
      });

      this._recordedChunks = [];

      this._mediaRecorder.addEventListener('dataavailable', e => {
        if(e.data.size > 0) {
          this._recordedChunks.push(e.data)
        }
      });

      this._mediaRecorder.addEventListener('stop', e => {
        let blob = new Blob(this._recordedChunks, {
          type: this._mimeType
        });

        let fileName = `rec${Date.now()}.webm`;

        let file = new File([blob], fileName, {
          type: this._mimeType,
          lastModified: Date.now()
        });

        let reader = new FileReader();

        reader.onload = e => {
          let audio = new Audio(reader.result);
          audio.play();
        }

        reader.readAsDataURL(file)

      });

      this._mediaRecorder.start();
      this.startTimer();
    }
  }

  stopRecorder() {
    if(this.isAvailable()) {
      this._mediaRecorder.stop();
      this.stop();
      this.stopTimer();
    }
  }

  startTimer() {
    let start = Date.now();//pega a hora atual

    this._recordMicrophoneInterval = setInterval(() => {
      this.trigger('recordtimer', Date.now() - start);
    }, 1000);
  }

  stopTimer() {
    clearInterval(this._recordMicrophoneInterval);//zera o setInterval, nunca esquecer desse comando!
  }
}