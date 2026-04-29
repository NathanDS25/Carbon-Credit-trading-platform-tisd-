import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { ShoppingBag, Search, Filter, ArrowUpRight, Award, MapPin, MessageSquare } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem('userRole') || 'COMPANY';

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await api.get('/marketplace');
      setListings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (listingId) => {
    try {
      // In a real scenario, this would trigger MetaMask first
      toast.loading("Initiating Blockchain Transaction...");
      const response = await api.post(`/marketplace/buy/${listingId}`, {
        txHash: '0x' + Math.random().toString(16).slice(2) // Mock TX for now
      });
      toast.dismiss();
      toast.success("Transaction Successful! Credits added to portfolio.");
      fetchListings();
    } catch (error) {
      toast.dismiss();
      toast.error("Purchase failed");
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-8">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black flex items-center gap-3">
              <ShoppingBag className="text-primary" size={32} /> Credit Marketplace
            </h2>
            <p className="text-text-secondary text-sm mt-1">Direct exchange for verified carbon offsets</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search NGOs or regions..." 
                className="bg-surface border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:border-primary outline-none w-64"
              />
            </div>
            <button className="p-2 rounded-lg bg-surface border border-white/10 text-text-secondary hover:text-text-primary">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.length === 0 ? (
            <div className="col-span-3 py-20 text-center glass rounded-2xl border border-white/5">
              <p className="text-text-secondary">No active credit listings found. Start by minting some as an NGO!</p>
            </div>
          ) : listings.map((listing, i) => (
            <div key={i} className="glass p-6 rounded-2xl border border-white/5 card-glow relative group">
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 rounded-xl bg-surface group-hover:bg-primary/20 transition-all shadow-lg group-hover:shadow-glow-green">
                  <Award className="text-primary" size={24} />
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-text-secondary uppercase">Price per Ton</span>
                  <p className="text-xl font-bold text-primary">₹{listing.pricePerCreditINR.toLocaleString()}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold truncate">{listing.seller?.name || 'Verified NGO'}</h3>
                  <p className="text-xs text-text-secondary flex items-center gap-1">
                    <Award size={12} className="text-info" /> Quality Grade: {listing.qualityGrade}
                  </p>
                </div>

                <div className="flex items-center justify-between py-4 border-y border-white/5">
                  <div className="text-center">
                    <p className="text-[10px] text-text-secondary uppercase font-bold">Credits</p>
                    <p className="font-mono font-bold">{listing.creditsAmount}</p>
                  </div>
                  <div className="w-[1px] h-8 bg-white/5"></div>
                  <div className="text-center">
                    <p className="text-[10px] text-text-secondary uppercase font-bold">Status</p>
                    <p className="font-bold text-primary">{listing.status}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>Contact: {listing.seller?.email}</span>
                  <span className="flex items-center gap-1 font-mono text-info">
                    {listing.pricePerCreditETH} ETH
                  </span>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    onClick={() => handleBuy(listing.id)}
                    className="flex-[2] btn-primary flex items-center justify-center gap-2 py-3"
                  >
                    Trade <ArrowUpRight size={16} />
                  </button>
                  <button 
                    onClick={() => window.location.href = `/chat?with=${listing.sellerId}`}
                    className="flex-1 p-3 rounded-lg bg-white/5 border border-white/10 text-text-secondary hover:text-primary transition-all flex items-center justify-center"
                  >
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
