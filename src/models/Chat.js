import { Model } from "./Model";
import { Firebase } from "../utils/Firebase";

export class Chat extends Model {
  constructor() {
    super();

  }

  get users() {return this._data.users}
  set users(value) {return this._data.users = value}

  get timeStamp() {return this._data.timeStamp}
  set timeStamp(value) {return this._data.timeStamp = value}



  static getRef() {
    return Firebase.db().collection('/chats');
  }

  static find(myEmail, contactEmail) {//quais sãos os dois contatos que tem esse email e que são true
    return Chat.getRef()
    .where(btoa(myEmail), '==', true)
    .where(btoa(contactEmail), '==', true)
    .get()
  }

  static create(myEmail, contactEmail) {
    return new Promise((resolve, reject) => {
      let users = {};
      users[btoa(myEmail)] = true
      users[btoa(contactEmail)] = true

      Chat.getRef().add({
        users,
        timeStamp: new Date()
      }).then(doc => {
        Chat.getRef().doc(doc.id).get().then(chat => {
          resolve(chat)
        }).catch(err => {
          reject(err)
        })
      }).catch(err => {
        reject(err)
      })
    });
  }

  static createIfNotExists(myEmail, contactEmail) {
    return new Promise((resolve, reject) => {
      Chat.find(myEmail, contactEmail).then(chats => {
        if(chats.empty) {
          Chat.create(myEmail, contactEmail).then(chat => {
            resolve(chat)
          })
        }
        else {
          chats.forEach(chat => {
            resolve(chat)
          })
        }
      }).catch(err => {
        reject(err)
      })
    });
  }

}