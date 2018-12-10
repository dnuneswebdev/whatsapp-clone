const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {
  constructor() {
    this._config = {
      apiKey: "AIzaSyA2rQUgOR96rS3T44rH5XrywwG0ZY7zIM4",
      authDomain: "whatsapp-clone-6af41.firebaseapp.com",
      databaseURL: "https://whatsapp-clone-6af41.firebaseio.com",
      projectId: "whatsapp-clone-6af41",
      storageBucket: "whatsapp-clone-6af41.appspot.com",
      messagingSenderId: "463822800740"
    };

    this.init();
  }

  init() {
    if(!window._initializedFirebase) {
      firebase.initializeApp(this._config);

      firebase.firestore().settings({
        timestampsInSnapshots: true
      });

      window._initializedFirebase = true;
    }
  } 

  initAuth() {
    return new Promise((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();

      firebase.auth().signInWithPopup(provider).then(result => {
        let token = result.credential.accessToken;
        let user = result.user;

        resolve({
          user, 
          token
        });

      }).catch(err => {
        reject(err)
      })
    })
  }

  static db() {
    return firebase.firestore();
  }

  static hd() {
    return firebase.storage();
  }
}