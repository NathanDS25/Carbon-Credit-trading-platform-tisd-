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
    addLogToConsole("INITIATING METAMASK HANDSHAKE...");
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Requesting account access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts',
          params: [] 
        });
        
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const browserSigner = await browserProvider.getSigner();
        
        setAccount(accounts[0]);
        setProvider(browserProvider);
        setSigner(browserSigner);

        const balanceRaw = await browserProvider.getBalance(accounts[0]);
        setBalance(ethers.formatEther(balanceRaw));

        toast.success("Web3 Link Established");
        console.log("Connected Account:", accounts[0]);
      } catch (error) {
        console.error("Wallet Connection Error:", error);
        if (error.code === 4001) {
          toast.error("Please approve the MetaMask request");
        } else {
          toast.error("Web3 Connection Failed");
        }
      }
    } else {
      toast.error("MetaMask Missing: Please install the extension");
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  // Helper for dashboard console
  const addLogToConsole = (msg) => {
    window.dispatchEvent(new CustomEvent('terminal-log', { detail: msg }));
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts.length > 0 ? accounts[0] : null);
      });
      window.ethereum.on('chainChanged', () => window.location.reload());
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, signer, balance, connectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
