class WhatsAppController {
  constructor() {
    

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
      console.log(this.el.inputNamePanelEditProfile.innerHTML)//como é uma DIV e não um INPUT, não tem o .value
    });

    this.el.formPanelAddContact.on('submit', e => {
      e.preventDefault();
      let formData = new FormData(this.el.formPanelAddContact);//ja trata os campos e recupera os dados com base no 'name'
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
    });

    this.el.btnClosePanelCamera.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelMessagesContainer.show();
    });

    this.el.btnTakePicture.on('click', e => {
      console.log('abrir camera')
    });

    this.el.btnAttachDocument.on('click', e => {
      this.closeAllMainPanel();
      this.el.panelDocumentPreview.css({height: 'calc(100% - 120px)'});
      this.el.panelDocumentPreview.addClass('open');
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

    this.el.btnEmojis.on('click', e => {
      this.el.panelEmojis.toggleClass('open')
    });

    this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
      emoji.on('click', e => {
        console.log(emoji.dataset.unicode)
      })
    });

    this.el.btnSend.on('click', e => {
      console.log(this.el.inputText.innerHTML)
    });


    // --------------------------------------------------
    // MICROPHONE EVENTS
    // --------------------------------------------------
    this.el.btnSendMicrophone.on('click', e => {
      this.el.recordMicrophone.show();
      this.el.btnSendMicrophone.hide();
      this.startRecordMicrophoneTimer();
    });

    this.el.btnCancelMicrophone.on('click', e => {
      this.closeRecordMicrophone()
    });

    this.el.btnFinishMicrophone.on('click', e => {
      this.closeRecordMicrophone()
    });


  }


  // --------------------------------------------------
  // MICROPHONE TIMER METHOD
  // --------------------------------------------------
  startRecordMicrophoneTimer() {
    let start = Date.now();//pega a hora atual

    this._recordMicrophoneInterval = setInterval(() => {
      this.el.recordMicrophoneTimer.innerHTML = Format.toTime(Date.now() - start);
    }, 1000);
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
    clearInterval(this._recordMicrophoneInterval);//zera o setInterval, nunca esquecer desse comando!
  }






}