import { useContext } from 'react';
import { AuthContext } from '../components/Authentication/AuthContext';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../services/firebase';

export function useAuth() {
  const { currentUser } = useContext(AuthContext);
  
  async function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  
  async function register(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }
  
  async function logout() {
    return signOut(auth);
  }
  
  return {
    currentUser,
    login,
    register,
    logout
  };
}