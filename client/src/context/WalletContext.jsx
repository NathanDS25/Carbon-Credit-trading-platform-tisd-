import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import toast from 'react-hot-toast';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [balance, setBalance] = useState('0');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const browserSigner = await browserProvider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(browserProvider);
        setSigner(browserSigner);

        const balanceRaw = await browserProvider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balanceRaw));

        toast.success("Wallet Connected: " + accounts[0].substring(0, 6) + "...");
      } catch (error) {
        console.error("Wallet Connection Error:", error);
        toast.error("Failed to connect MetaMask");
      }
    } else {
      toast.error("MetaMask not found. Please install the extension.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, signer, balance, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
