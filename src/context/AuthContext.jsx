import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../config/firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // For Demo Purposes: Bypass Firebase if no real config
  const isDemo = import.meta.env.VITE_FIREBASE_API_KEY ? false : true;

  async function login(email, password) {
    if (isDemo) return mockLogin(email, 'ngo');
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function signup(email, password) {
    if (isDemo) return mockLogin(email, 'ngo');
    return createUserWithEmailAndPassword(auth, email, password);
  }

  async function loginWithGoogle() {
    if (isDemo) return mockLogin('demo@google.com', 'business');
    return signInWithPopup(auth, googleProvider);
  }

  async function logout() {
    if (isDemo) {
      setCurrentUser(null);
      setUserRole(null);
      return;
    }
    return signOut(auth);
  }

  async function setRole(role) {
    if (isDemo) {
      setUserRole(role);
      return;
    }
    if (currentUser) {
      await setDoc(doc(db, 'users', currentUser.uid), { role }, { merge: true });
      setUserRole(role);
    }
  }

  // Mock Login for frontend demonstration without backend setup
  function mockLogin(email, defaultRole) {
    const mockUser = { uid: 'mock123', email, displayName: 'Demo User' };
    setCurrentUser(mockUser);
    setUserRole(defaultRole);
    return Promise.resolve(mockUser);
  }

  useEffect(() => {
    if (isDemo) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user role from Firestore
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        } else {
          setUserRole(null); // Needs to select role
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isDemo]);

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    loginWithGoogle,
    logout,
    setRole,
    mockLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
