firebaseConfig = {
  apiKey: "AIzaSyBB2K540j-GerRu7UoIKFZjfsMMRLYcfnk",
  authDomain: "react-messenger-c3d72.firebaseapp.com",
  projectId: "react-messenger-c3d72",
  storageBucket: "react-messenger-c3d72.firebasestorage.app",
  messagingSenderId: "652932615126",
  appId: "1:652932615126:web:0136d8d2da5061ded03277"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);