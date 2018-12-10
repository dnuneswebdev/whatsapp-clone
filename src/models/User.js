import {Firebase} from './../utils/Firebase';
import { Model } from './Model';

export class User extends Model{
  constructor(email) {//traz o email la da promise do whatsappcontroller
    super();//chama a classe Model

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

  // --------------------------------------------------
  // STATIC
  // --------------------------------------------------
  static getRef() {
    return Firebase.db().collection('/users');
  }

  static findByEmail(email) {
    return User.getRef().doc(email);
  }

  // --------------------------------------------------
  // METHODS
  // --------------------------------------------------
  getById(emailId) {
    return new Promise((resolve, reject) => {
      User.findByEmail(emailId).onSnapshot(doc => {
        this.fromJSON(doc.data())
        resolve(doc)
      });
    })
  }

  save() {
    return User.findByEmail(this.email).set(this.toJSON())
  }
}