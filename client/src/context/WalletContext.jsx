import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [provider, setProvider] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const userBalance = await browserProvider.getBalance(accounts[0]);
        
        setAccount(accounts[0]);
        setBalance(ethers.formatEther(userBalance));
        setProvider(browserProvider);
        setIsConnected(true);
        
        localStorage.setItem('walletConnected', 'true');
      } catch (error) {
        console.error("Wallet connection failed:", error);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance('0');
    setIsConnected(false);
    localStorage.removeItem('walletConnected');
  };

  useEffect(() => {
    if (localStorage.getItem('walletConnected') === 'true') {
      connectWallet();
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnectWallet();
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, balance, isConnected, connectWallet, disconnectWallet, provider }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
