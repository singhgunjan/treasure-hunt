import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyCFh0HoaTZ6NDL9CLIn0MmtnSvgEDabUHE",
  authDomain: "treasure-hunt-91762.firebaseapp.com",
  projectId: "treasure-hunt-91762",
  storageBucket: "treasure-hunt-91762.appspot.com",
  messagingSenderId: "156208178428",
  appId: "1:156208178428:web:d6101559e0e8779e1e2379",
  measurementId: "G-97D07WL48H"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;