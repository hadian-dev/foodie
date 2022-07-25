import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import * as storage from 'firebase/storage';
import * as auth from 'firebase/auth';

import { firebaseConfig } from './config';
import { User } from 'firebase/auth';

// import 'firebase/auth';
// import 'firebase/firestore';
// import 'firebase/storage';
// import 'firebase/analytics';
// import 'firebase/performance';

// // Initialize Firebase
// export default function initFirebase() {
//   // Check if app no exists
//   if (!getApps().length) {
//     const app = initializeApp(firebaseConfig);

//     if (typeof window !== 'undefined') {
//       // Enable Analytics and Performance
//       getAnalytics(app);
//       getPerformance(app);
//     }

//     console.log('Firebase was Successfully init!');
//   }
// }

class Firebase {
  app;
  db;
  auth;
  storage;
  recaptcha: auth.RecaptchaVerifier | undefined;

  constructor() {
    this.app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    this.db = getFirestore();
    this.storage = storage.getStorage();
    this.auth = auth.getAuth();
  }

  signup = (email: string, password: string) => {
    auth.createUserWithEmailAndPassword(this.auth, email, password);
  };

  signInWithEmail = (email: string, password: string) => {
    auth.signInWithEmailAndPassword(this.auth, email, password);
  };

  signInWithPhoneNumber = (phoneNumber: string) => {
    return auth.signInWithPhoneNumber(this.auth, phoneNumber, this.getRecaptcha());
  };

  signOut = () => {
    auth.signOut(this.auth);
  };

  resetPassword = (email: string) => {
    auth.sendPasswordResetEmail(this.auth, email);
  };

  getRecaptcha = () => {
    if (this.recaptcha) {
      return this.recaptcha;
    } else {
      const recaptcha = new auth.RecaptchaVerifier('recaptcha-container', {}, this.auth);

      this.recaptcha = recaptcha;
      recaptcha.render();

      return recaptcha;
    }
  };

  /* 
    ---------------------- Update Profile --------------------------
  */
  async updateProfile(data: { displayName: string; photo: File | string }) {
    if (data.photo && typeof data.photo !== 'string') {
      const path = `user/images/${this.auth.currentUser?.uid}.png`;
      const photoURL = (await this.upload(data.photo, path))?.fileURL || '';

      await auth.updateProfile(this.auth.currentUser as User, {
        displayName: data.displayName,
        photoURL,
      });
    } else {
      await auth.updateProfile(this.auth.currentUser as User, {
        displayName: data.displayName,
        photoURL: '',
      });
    }
  }

  async upload(file: File, url: string) {
    try {
      const fileRef = storage.ref(this.storage, url);

      const snapshot = await storage.uploadBytes(fileRef, file);
      const fileURL = await storage.getDownloadURL(fileRef);

      return { snapshot, fileURL };
    } catch (error) {
      // Notting
    }

    return null;
  }

  onAuthStateChange = () => {
    return new Promise((resolve, reject) => {
      auth.onAuthStateChanged(this.auth, (user) => {
        console.log(firebaseConfig);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('Auth State Change Failed'));
        }
      });
    });
  };
}

const firebaseApp = new Firebase();

export default firebaseApp;
