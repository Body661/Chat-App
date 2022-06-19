import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyDJ_p8XLM6-rsF1aABED85Qq1X8jTbiCJQ",
    authDomain: "whatsapp-7f1c2.firebaseapp.com",
    projectId: "whatsapp-7f1c2",
    storageBucket: "whatsapp-7f1c2.appspot.com",
    messagingSenderId: "477231419939",
    appId: "1:477231419939:web:2a0e71e1dfaf09a1329796"
};

const app = !firebase.apps.length
    ? firebase.initializeApp(firebaseConfig)
    : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider }