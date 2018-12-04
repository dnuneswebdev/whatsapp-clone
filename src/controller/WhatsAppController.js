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
      this.style.display = (this.style.display === "none") ? 'block' : 'none';
      return this;
    }

    Element.prototype.on = function(events, fn) {
      events.split(' ').forEach(event => {
        this.addEventListener(event, fn);
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

       return json
    }

  }

  initEvents() {
    //////////////EVENTOS DE OPEN E CLOSE DOS PAINEIS ADD USER E EDIT PROFILE
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

    ////////////EVENTOS DE ADICIONAR FOTO DO USER E FORMDATA
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


    })
  }

  closeAllLeftPanel() {//metodo que garante que sempre todas os paineis estarão fechados para evitar probelams de z-index
    this.el.panelAddContact.hide();
    this.el.panelEditProfile.hide();
  }






}