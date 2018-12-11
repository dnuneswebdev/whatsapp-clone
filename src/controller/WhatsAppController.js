import {Format} from './../utils/Format';
import {CameraController} from './CameraController';
import {MicrophoneController} from './MicrophoneController';
import {DocumentPreviewController} from './DocumentPreviewController';
import {Firebase} from './../utils/Firebase';
import { User } from '../models/User';

export class WhatsAppController {
  constructor() {
    this._firebase = new Firebase();
    this.initAuth();

    this.elementsPrototype();
    this.loadElements();
    this.initEvents();
 
  }

  loadElements() {
    this.el = {};//objeto vazio que sera alimentado com todos os elementos que tenham ID do html

    document.querySelectorAll('[id]').forEach(element => {//seleciona todos os ID do arquivo html
      this.el[Format.getCamelCase(element.id)] = element;
    });
  }

  //--------------------------------------------------
  // PROTOTYPE
  // --------------------------------------------------
  elementsPrototype() {
    Element.prototype.hide = function() {
      this.style.display = "none";
      return this;//serve para encadear prototypes, ex: app.el.btnSubmit.show().addClass();
    }

    Element.prototype.show = function() {
      this.style.display = "block";
      return this;
    }

    Element.prototype.toggle = function() {
      this.style.display = !this.style.display;
      return this;
    }

    Element.prototype.on = function(events, fn) {//automatiza a criação dos eventos: 'click', 'mouseover', 'keyup', etc...
      events.split(' ').forEach(event => {//se tiver multiplos eventos, separa cada um com o split e loopa 
        this.addEventListener(event, fn);//adiciona o eventListener recebendo qual é o evento e a função
      });
      return this;
    }

    Element.prototype.css = function(styles) {
      for(let name in styles) {
        this.style[name] = styles[name];
      }
      return this;
    }

    Element.prototype.addClass = function(className) {
      this.classList.add(className)
      return this;
    }

    Element.prototype.removeClass = function(className) {
      this.classList.remove(className)
      return this;
    }

    Element.prototype.toggleClass = function(className) {
      this.classList.toggle(className)
      return this;
    }

    Element.prototype.hasClass = function(className) {
      return this.classList.contains(className)//retorna boolean se tem ou nao uma classe
    }

    HTMLFormElement.prototype.getForm = function() {//cria um formData 
      return new FormData(this)
    }

    HTMLFormElement.prototype.toJSON = function () {//passa o formData de qualquer formulario criado, e cria um objeto JSON
       let json = {};

       this.getForm().forEach((value, key) => {
         json[key] = value;
       });
       console.log(json)
       return json
    }



  }

  initEvents() {
    // --------------------------------------------------
    // EVENTOS DE OPEN E CLOSE DOS PAINEIS ADD USER E EDIT PROFILE
    // --------------------------------------------------
    this.el.myPhoto.on('click', e => {//abre o painel de editar o profile
      this.closeAllLeftPanel();
      this.el.panelEditProfile.show();
      setTimeout(() => {//esse setTimeout evita problemas de transition com o CSS
        this.el.panelEditProfile.addClass('open');
      }, 100);   
    });

    this.el.btnNewContact.on('click', e => {//abre o painel de adicionar contato
      this.closeAllLeftPanel();
      this.el.panelAddContact.show();
      setTimeout(() => {
        this.el.panelAddContact.addClass('open');
      }, 100);
    });

    this.el.btnClosePanelEditProfile.on('click', e => {//remove a class open do painel
      this.el.panelEditProfile.removeClass('open');
    });

    this.el.btnClosePanelAddContact.on('click', e => {//remove a class open do painel
      this.el.panelAddContact.removeClass('open');
    });

    // --------------------------------------------------
    // EVENTOS DE ADICIONAR FOTO DO USER E FORMDATA
    // --------------------------------------------------
    this.el.photoContainerEditProfile.on('click', e => {
      this.el.inputProfilePhoto.click();//força o click no <input type="file">
    });

    this.el.inputNamePanelEditProfile.on('keypress', e => {
      if(e.key === 'Enter') {
        e.preventDefault();
        this.el.btnSavePanelEditProfile.click();
      }
    });

    this.el.btnSavePanelEditProfile.on('click', e => {
      this.el.btnSavePanelEditProfile.disabled = true;

      this._user.name = this.el.inputNamePanelEditProfile.innerHTML//como é uma DIV e não um INPUT, não tem o .value
      this._user.save().then(() => {
        this.el.btnSavePanelEditProfile.disabled = false;
      });
    });

    this.el.formPanelAddContact.on('submit', e => {
      e.preventDefault();
      let formData = new FormData(this.el.formPanelAddContact);//ja trata os campos e recupera os dados com base no 'name'
      let contact = new User(formData.get('email'));

      contact.on('dataChange', data => {
        if(data.name) {
          this._user.addContact(contact).then(() => {//recebe la do User.js e resolve
            this.el.btnClosePanelAddContact.click();
            console.log('contato add', contact);
          })
        } 
        else {
          console.error('usuario nao encontrado')
        }
      })
     
    });

    // --------------------------------------------------
    // CONTACT LIST EVENTS
    // --------------------------------------------------
    this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {//parent, pega cada contact e loopa com evento click
      item.on('click', e => {
        this.el.home.hide();//esconde a home
        this.el.main.css({display: 'flex'});//mostra a tela de mensagem
      });
    });

    // --------------------------------------------------
    // MENU ANEXAR
    // --------------------------------------------------
    this.el.btnAttach.on('click', e => {
      e.stopPropagation();//não executa outros eventos de niveis anteriores (parents)

      this.el.menuAttach.toggleClass('open');
      document.addEventListener('click', this.closeMenuAttach.bind(this));
    });

    this.el.btnAttachPhoto.on('click', e => {
      this.el.inputPhoto.click();
    });

    this.el.inputPhoto.on('change', e => {
      [...this.el.inputPhoto.files].forEach(file => {
        console.log(file)
      });
    });

    this.el.btnAttachCamera.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.hide();
      this.el.panelCamera.css({height: 'calc(100% - 120px)'});
      this.el.panelCamera.addClass('open');

      this._camera = new CameraController(this.el.videoCamera);//cria uma instancia da cameracontroller e passa o id do video
    });

    this.el.btnClosePanelCamera.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
      this._camera.stop();
    });

    this.el.btnTakePicture.on('click', e => {
      let dataUrl = this._camera.takePicture();

      this.el.pictureCamera.src = dataUrl;
      this.el.pictureCamera.show();
      this.el.videoCamera.hide();
      this.el.btnReshootPanelCamera.show();
      this.el.containerTakePicture.hide();
      this.el.containerSendPicture.show();
    });

    this.el.btnReshootPanelCamera.on('click', e => {
      this.el.pictureCamera.hide();
      this.el.videoCamera.show();
      this.el.btnReshootPanelCamera.hide();
      this.el.containerTakePicture.show();
      this.el.containerSendPicture.hide();
    });

    this.el.btnSendPicture.on('click', e => {
      console.log(this.el.pictureCamera.src)
    });

    this.el.btnAttachDocument.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelDocumentPreview.css({height: 'calc(100% - 120px)'});
      this.el.panelDocumentPreview.addClass('open');
      this.el.inputDocument.click();
    });

    this.el.inputDocument.on('change', e => {
      if(this.el.inputDocument.files.length) {
        this.el.panelDocumentPreview.css({height: '1%'});

        let file = this.el.inputDocument.files[0]
        
        this._documentPreviewController = new DocumentPreviewController(file);

        this._documentPreviewController.getPreviewData().then(result => {
          this.el.imgPanelDocumentPreview.src = result.src;
          this.el.infoPanelDocumentPreview.innerHTML = result.info;
          this.el.imagePanelDocumentPreview.show();
          this.el.filePanelDocumentPreview.hide();
          this.el.panelDocumentPreview.css({height: 'calc(100% - 120px)'});
        }).catch(err => {
          this.el.panelDocumentPreview.css({height: 'calc(100% - 120px)'});

          console.log(file.type)
          switch(file.type) {
            case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
            case 'application/vnd.ms-excel':
            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
            break;

            case 'application/msword':
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
            break;

            case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
            case 'application/vnd.ms-powerpoint':
            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
            break;

            default:
            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';
            break;
          }

          this.el.filenamePanelDocumentPreview.innerHTML = file.name
          this.el.imagePanelDocumentPreview.hide();
          this.el.filePanelDocumentPreview.show();
          console.log(err)
        });
      };      
    });

    this.el.btnClosePanelDocumentPreview.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
    });

    this.el.btnSendDocument.on('click', e => {
      console.log('send document')
    });

    this.el.btnAttachContact.on('click', e => {
      this.el.modalContacts.show();
    });

    this.el.btnCloseModalContacts.on('click', e => {
      this.el.modalContacts.hide();
    });

    // --------------------------------------------------
    // INPUT MESSAGE
    // --------------------------------------------------
    this.el.inputText.on('keyup', e => {
      if(this.el.inputText.innerHTML.length) {
        this.el.inputPlaceholder.hide();
        this.el.btnSendMicrophone.hide();
        this.el.btnSend.show()
      }
      else {
        this.el.inputPlaceholder.show();
        this.el.btnSendMicrophone.show();
        this.el.btnSend.hide()
      }
    });

    this.el.inputText.on('keypress', e => {
      if(e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        this.el.btnSend.click();
      }
    });

    this.el.btnSend.on('click', e => {
      console.log(this.el.inputText.innerHTML)
    });

    // --------------------------------------------------
    // EMOJIS EVENTS
    // --------------------------------------------------
    this.el.btnEmojis.on('click', e => {
      this.el.panelEmojis.toggleClass('open')
    });

    this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
      emoji.on('click', e => {
        console.log(emoji.dataset.unicode)
        let img = this.el.imgEmojiDefault.cloneNode();//tem que clocar o elemento pra ele sempre existir no painel

        img.style.cssText = emoji.style.cssText;
        img.dataset.unicode = emoji.dataset.unicode;
        img.alt = emoji.dataset.unicode;

        emoji.classList.forEach(name => {//loop pra pegar todas as classes dos emojis e alimentar o 'img'
          img.classList.add(name)
        });

        let cursor = window.getSelection();//pega a seleção do cursor, os carcteres selecionados

        if(!cursor.focusNode || !cursor.focusNode.id == 'input-text') {//precisa saber se o cursor esta focado em alguma coisa e é diferente do input-text
          this.el.inputText.focus();
          cursor = window.getSelection();//recria o getSelection e pega a seleção de onde está
        }

        let range = document.createRange();//cria uma instancia do createRange()

        range = cursor.getRangeAt(0);//define a posição atual do cursor, ponto de inicio que você comeceu a selecionar
        range.deleteContents();//deleta oque foi selecionado

        let frag = document.createDocumentFragment();//cria uma instancia methodo de interferencia

        frag.appendChild(img);//joga a imagem noponto selecionado
        range.insertNode(frag);//joga a interferencia dentro do node
        range.setStartAfter(img);//empurra o cursor para depois da imagem

        this.el.inputText.dispatchEvent(new Event('keyup'));//força o disparo de um evento, nesse caso para tirar o placeholder

      });
    });
    
    // --------------------------------------------------
    // MICROPHONE EVENTS
    // --------------------------------------------------
    this.el.btnSendMicrophone.on('click', e => {
      this.el.recordMicrophone.show();
      this.el.btnSendMicrophone.hide();

      this._microphoneController = new MicrophoneController();

      this._microphoneController.on('ready', audio => {
        console.log('ready event');
        this._microphoneController.startRecorder();
      });

      this._microphoneController.on('recordtimer', timer => {
        this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
      });
    });

    this.el.btnCancelMicrophone.on('click', e => {
      this._microphoneController.stopRecorder();
      this.closeRecordMicrophone()
    });

    this.el.btnFinishMicrophone.on('click', e => {
      this._microphoneController.stopRecorder();
      this.closeRecordMicrophone()
    });
  }

  // --------------------------------------------------
  // AUTH FIREBASE
  // --------------------------------------------------
  initAuth() {
    this._firebase.initAuth().then(response =>  {//obtem as respostas dos dados da autenticação
      this._user = new User(response.user.email);//passa some o email para a class User

      this._user.on('dataChange', data => {//esse data é o retorno do toJSON() que vem do model.js
        document.querySelector('title').innerHTML = `${data.name} - WhatsApp CLone`

        this.el.inputNamePanelEditProfile.innerHTML = data.name;

        if(data.photo) {//se tem foto, ja mostra a foto vinculado do gmail como de usuario
          let photo = this.el.imgPanelEditProfile;
          photo.src = data.photo;
          photo.show();
          this.el.imgDefaultPanelEditProfile.hide()

          let photo2 = this.el.myPhoto.querySelector('img');
          photo2.src = data.photo;
          photo2.show();
        }

        this.initContacts();
      })

      this._user.name = response.user.displayName;//salva os dados que vem do firebase
      this._user.email = response.user.email;
      this._user.photo = response.user.photoURL;

      this._user.save().then(() => {
        this.el.appContent.css({display: 'flex'});
      })
 
    }).catch(err => {
      console.error(err)
    })
  }

  // --------------------------------------------------
  // CONTACTS METHODS
  // --------------------------------------------------
  initContacts() {
    this._user.on('contactsChange', docs => {
      this.el.contactsMessagesList.innerHTML = '';
      docs.forEach(doc => {
        let contact = doc.data();
        let div = document.createElement('div');

        div.className = 'contact-item';
    
        div.innerHTML = `
        <div class="dIyEr">
          <div class="_1WliW" style="height: 49px; width: 49px;">
            <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
            <div class="_3ZW2E">
              <span data-icon="default-user" class="">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                  <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                  <g fill="#FFF">
                    <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                  </g>
                </svg>
              </span>
            </div>
          </div>
        </div>
        <div class="_3j7s9">
          <div class="_2FBdJ">
            <div class="_25Ooe">
              <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
            </div>
            <div class="_3Bxar">
              <span class="_3T2VG">${contact.lastMessageTime}</span>
            </div>
          </div>
          <div class="_1AwDx">
            <div class="_itDl">
              <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>
    
              <span class="_2_LEW last-message">
                <div class="_1VfKB">
                  <span data-icon="status-dblcheck" class="">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                      <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                    </svg>
                  </span>
                </div>
                <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                <div class="_3Bxar">
                  <span>
                    <div class="_15G96">
                      <span class="OUeyt messages-count-new" style="display:none;">1</span>
                    </div>
                </div>
              </span>
            </div>
          </div>
        </div>`;

        if(contact.photo) {
          let img = div.querySelector('.photo');
          img.src = contact.photo;
          img.show();
        }
        
        div.on('click', e => {
          this.el.activeName.innerHTML = contact.name;
          this.el.activeStatus.innerHTML = contact.status;
          if(contact.photo) {
            let img = this.el.activePhoto;
            img.src = contact.photo;
            img.show();
          }
          this.el.home.hide();
          this.el.main.css({display: 'flex'})
        });

        this.el.contactsMessagesList.appendChild(div)
      })
    })

    this._user.getContacts()
  }


  // --------------------------------------------------
  // CLOSE METHODS
  // --------------------------------------------------
  closeAllMainPanel() {
    this.el.panelMessagesContainer.hide();
    this.el.panelCamera.removeClass('open');
    this.el.panelDocumentPreview.removeClass('open');
  }

  closeMenuAttach(e) {
    document.removeEventListener('click', this.closeMenuAttach);
    this.el.menuAttach.removeClass('open');
  }

  closeAllLeftPanel() {//metodo que garante que sempre todas os paineis estarão fechados para evitar probelams de z-index
    this.el.panelAddContact.hide();
    this.el.panelEditProfile.hide();
  }

  closeRecordMicrophone() {
    this.el.recordMicrophone.hide();
    this.el.btnSendMicrophone.show();
  }
}