import {Firebase} from './../utils/Firebase';
import { Model } from './Model';

export class User extends Model{
  constructor(email) {//traz o email la da promise do whatsappcontroller
    super();//chama o constructor da classe Model

    if(email) this.getById(email)
  }

  // --------------------------------------------------
  // GETTERS AND SETTERS
  // --------------------------------------------------
  get name() {return this._data.name;}
  set name(value) {this._data.name = value;}

  get email() {return this._data.email;}
  set email(value) {this._data.email = value;}

  get photo() {return this._data.photo;}
  set photo(value) {this._data.photo = value;}

  get chatId() {return this._data.chatId;}
  set chatId(value) {this._data.chatId = value;}
  

  // --------------------------------------------------
  // STATIC
  // --------------------------------------------------
  static getRef() {
    return Firebase.db().collection('/users');
  }

  static findByEmail(email) {
    return User.getRef().doc(email);
  }

  static getContactRef(email) {
    return User.getRef()
    .doc(email)
    .collection('contacts')
  }

  // --------------------------------------------------
  // METHODS
  // --------------------------------------------------
  getById(emailId) {
    return new Promise((resolve, reject) => {
      User.findByEmail(emailId).onSnapshot(doc => {//snapShot fica ouvindo mudanças em tempo real
        this.fromJSON(doc.data())
        resolve(doc)//depois que todo a logica é resolvida, volta pra ca pra avisar que deu tudo certo
      });
    })
  }

  save() {
    return User.findByEmail(this.email).set(this.toJSON())
  }

  addContact(contact) {
    return User.getRef()//pega a referencia no banco
    .doc(this.email)//pega o usuario que está fazendo a requisição
    .collection('contacts')//entra na coleção daquele usuario
    .doc(btoa(contact.email))//pega o email do contato desejado e converte a string em base64 para nao ter problemas
    .set(contact.toJSON())//set salva la no db
  }

  getContacts() {
    return new Promise((resolve, reject) => {
      User.getContactRef(this.email).onSnapshot(docs => {
        let contacts = [];

        docs.forEach(doc => {
          let data = doc.data();

          data.id = doc.id;

          contacts.push(data)
        });
        this.trigger('contactsChange', docs);

        resolve(contacts)
      })
    });
  }
}