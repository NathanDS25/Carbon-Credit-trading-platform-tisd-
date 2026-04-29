import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useWallet } from '../context/WalletContext';
import { Send, ShieldCheck, Activity, ArrowRight, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const TradePage = () => {
  const { account, isConnected, balance } = useWallet();
  const [targetAddress, setTargetAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState(null);

  const handleTransfer = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.loading("Broadcasting to Sepolia Testnet...");
    
    // Simulate Blockchain TX
    setTimeout(() => {
      toast.dismiss();
      setTxHash('0x' + Math.random().toString(16).slice(2) + '...f92');
      toast.success("Credits Transferred Successfully!");
    }, 4000);
  };

  return (
    <DashboardLayout role="COMPANY">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black mb-2">P2P Credit Transfer</h2>
          <p className="text-text-secondary text-sm">Direct on-chain carbon credit exchange</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Transfer Form */}
          <div className="glass p-8 rounded-2xl border border-white/10 space-y-6">
            <div className="flex items-center gap-3 text-primary mb-2">
              <Send size={20} />
              <h3 className="font-bold uppercase tracking-widest text-sm">Transfer Assets</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-bold">Recipient Wallet</label>
                <div className="relative">
                  <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                  <input 
                    type="text" 
                    value={targetAddress}
                    onChange={(e) => setTargetAddress(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm focus:border-primary outline-none font-mono" 
                    placeholder="0x..." 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-text-secondary uppercase font-bold">Amount (CRX Tokens)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-sm focus:border-primary outline-none font-mono" 
                    placeholder="0.00" 
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-text-secondary">CRX</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                <div className="text-xs">
                  <p className="text-text-secondary">Transaction Fee (Gas)</p>
                  <p className="font-bold text-primary mt-1">~ 0.00042 ETH</p>
                </div>
                <ShieldCheck className="text-primary opacity-50" size={24} />
              </div>

              <button 
                onClick={handleTransfer}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2"
              >
                Confirm Blockchain Transfer <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Right: Wallet Stats & Recent TX */}
          <div className="space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
              <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">Active Portfolio</p>
              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-end">
                  <h4 className="text-4xl font-black text-primary">1.24k</h4>
                  <span className="text-sm font-bold text-primary opacity-50 mb-1">CRX TOKENS</span>
                </div>
                <div className="flex justify-between text-xs text-text-secondary pt-4 border-t border-white/5">
                  <span>Current Value</span>
                  <span className="text-text-primary font-mono">₹35.4L</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5 h-[340px] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-info" /> Blockchain Log
                </h3>
              </div>
              
              <div className="flex-1 space-y-4 overflow-auto">
                {txHash ? (
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
                    <p className="text-[10px] text-primary font-black uppercase mb-1">Success: Outgoing</p>
                    <p className="text-xs font-mono text-text-primary truncate">{txHash}</p>
                    <div className="mt-2 flex justify-between text-[10px] text-text-secondary">
                      <span>{amount} CRX</span>
                      <span>Just now</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-20">
                    <Activity size={48} className="mb-4" />
                    <p className="text-xs">Waiting for your first transaction...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TradePage;
