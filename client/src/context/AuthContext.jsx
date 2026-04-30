import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import api from '../services/api';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAjvqW7q3aucV3Qkp5ZELpDD4It70qMy98", // Ensure this is the key for carbonx-31b29
  authDomain: "carbonx-31b29.firebaseapp.com",
  projectId: "carbonx-31b29",
  storageBucket: "carbonx-31b29.firebasestorage.app",
  messagingSenderId: "118401187090",
  appId: "1:118401187090:web:c322948d982089ae7c07cb",
  measurementId: "G-T1YRXZEMV2"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(localStorage.getItem('userRole') || null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch full profile from our backend
        try {
          const idToken = await firebaseUser.getIdToken();
          localStorage.setItem('token', idToken);
          
          const response = await api.get('/auth/me');
          setUser(response.data.data);
          setRole(response.data.data.role);
          localStorage.setItem('userRole', response.data.data.role);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          if (localStorage.getItem('token') === 'mock-token') {
             setUser({ name: 'Developer User', email: 'dev@carbonx.com' });
          } else {
             setUser(firebaseUser);
             // If we reach here, it means user is in Firebase but not our DB yet
             // Force them to Role Selection
             if (window.location.pathname === '/login') {
                window.location.href = '/role-selection';
             }
          }
        }
      } else if (localStorage.getItem('token') === 'MOCK_DEV_TOKEN') {
        setUser({ id: 'dev-user-id', name: 'Developer User', email: 'dev@carbonx.com', role: localStorage.getItem('userRole') || 'NGO' });
        setLoading(false);
      } else {
        setUser(null);
        setRole(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const logout = () => signOut(auth);

  const selectRole = async (selectedRole) => {
    try {
      await api.post('/auth/update-role', { role: selectedRole });
      setRole(selectedRole);
      localStorage.setItem('userRole', selectedRole);
    } catch (error) {
      console.error("Failed to update role in backend:", error);
      // Still set locally for UX if backend fails
      setRole(selectedRole);
      localStorage.setItem('userRole', selectedRole);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout, selectRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
