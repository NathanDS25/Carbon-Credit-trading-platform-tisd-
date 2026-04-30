import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

import { useState } from 'react';
import toast from 'react-hot-toast';

const Login = () => {
  const { loginWithGoogle } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      // Force immediate check and redirect
      window.location.href = '/role-selection';
    } catch (error) {
      console.error("Google Auth Error:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        toast.error("Login cancelled. Please try again.");
      } else {
        toast.error("Auth failed: " + error.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="h-screen w-full relative flex items-center justify-center overflow-hidden">
      {/* Background with Generated Image */}
      <div 
        className="absolute inset-0 z-0 scale-110 blur-sm"
        style={{ 
          backgroundImage: `url('/carbonx_login_bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-background/70" />
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-md glass p-8 rounded-2xl shadow-2xl border border-white/10"
      >
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-primary/20 mb-4 shadow-glow-green">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-text-primary">
            CARBON<span className="text-primary">X</span>
          </h1>
          <p className="text-text-secondary mt-2">Next-Gen Carbon Credit Terminal</p>
        </div>

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 bg-white text-background font-bold py-3 rounded-lg hover:bg-white/90 transition-all duration-300 disabled:opacity-50"
          >
            {isLoggingIn ? (
              <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
            )}
            {isLoggingIn ? 'Establishing Secure Link...' : 'Sign in with Google'}
          </button>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-2 text-text-secondary">Or continue with</span>
            </div>
          </div>

          <input 
            type="email" 
            placeholder="Email Address" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-all"
          />

          <button 
            onClick={() => {
              // Dev bypass for role selection test
              localStorage.setItem('token', 'MOCK_DEV_TOKEN');
              window.location.href = '/role-selection';
            }}
            className="w-full text-[10px] text-text-secondary hover:text-primary transition-all uppercase tracking-widest mt-8 font-black"
          >
            Terminal Access Mode (Dev)
          </button>
        </div>

        <p className="text-center text-xs text-text-secondary mt-8">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
