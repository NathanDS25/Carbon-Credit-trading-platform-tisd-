import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { Upload, TreePine, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import SatelliteIntelligence from '../components/SatelliteIntelligence';

const PortfolioStrip = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    {[
      { label: 'Total Credits Earned', value: stats?.totalCredits || '0', color: 'text-primary' },
      { label: 'Available for Sale', value: stats?.availableCredits || '0', color: 'text-text-primary' },
      { label: 'Total Area (Sq Km)', value: stats?.totalArea || '0', color: 'text-info' },
      { label: 'Revenue (INR)', value: `₹${(stats?.revenue || 0).toLocaleString()}`, color: 'text-primary font-bold' },
    ].map((stat, i) => (
      <div key={i} className="glass p-6 rounded-xl border border-white/5 shadow-glow-green/10">
        <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold">{stat.label}</p>
        <h3 className={`text-2xl mt-2 ${stat.color}`}>{stat.value}</h3>
      </div>
    ))}
  </div>
);

const NGODashboard = () => {
  const [plantations, setPlantations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStatus, setUploadStatus] = useState('idle'); 
  const [formData, setFormData] = useState({ name: '', lat: '', lng: '', areaSqKm: '1.0' });
  const [file, setFile] = useState(null);
  const [selectedPlantation, setSelectedPlantation] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [locationName, setLocationName] = useState('');

  useEffect(() => {
    fetchPlantations();
    detectLocation(); // Proactive request
  }, []);

  const fetchPlantations = async () => {
    try {
      const response = await api.get('/plantations/mine');
      setPlantations(response.data.data);
      if (response.data.data.length > 0 && !selectedPlantation) {
        setSelectedPlantation(response.data.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch plantations:", error);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      toast.loading("Locating Orbital Position...", { id: 'gps' });
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({
          ...prev,
          lat: latitude.toFixed(6),
          lng: longitude.toFixed(6)
        }));
        toast.success("GPS Lock Established", { id: 'gps' });
        
        // Reverse Geocoding for "Human Readable" location
        try {
          const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}`);
          const data = await res.json();
          if (data.results?.[0]) {
            setLocationName(data.results[0].formatted_address);
          }
        } catch (e) {
          setLocationName(`${latitude.toFixed(2)}°N, ${longitude.toFixed(2)}°E`);
        }
      }, (error) => {
        toast.error("Location Access Denied. Please enable GPS.", { id: 'gps' });
      });
    } else {
      toast.error("Geolocation not supported");
    }
  };

  const scanSatellite = async () => {
    if (!formData.lat || !formData.lng) {
      toast.error("Please enter coordinates first");
      return;
    }
    setIsScanning(true);
    try {
      const response = await api.post('/plantations/preview', {
        lat: formData.lat,
        lng: formData.lng,
        areaSqKm: formData.areaSqKm
      });
      setPreviewData(response.data.data);
      toast.success("Satellite Probe Successful");
    } catch (error) {
      toast.error("Satellite Scan Failed: " + (error.response?.data?.error || "Connection error"));
    } finally {
      setIsScanning(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !formData.name || !formData.lat || !formData.lng) {
      toast.error("Please fill all fields and select an image");
      return;
    }

    setUploadStatus('uploading');
    const data = new FormData();
    data.append('image', file);
    data.append('name', formData.name);
    data.append('lat', formData.lat);
    data.append('lng', formData.lng);
    data.append('areaSqKm', formData.areaSqKm);

    try {
      await api.post('/plantations', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadStatus('analysis');
      toast.success("Upload successful! Satellite analysis started.");
      fetchPlantations();
      
      // Simulate analysis progress for UI
      setTimeout(() => setUploadStatus('complete'), 10000);
    } catch (error) {
      toast.error("Upload failed");
      setUploadStatus('idle');
    }
  };

  return (
    <DashboardLayout role="NGO">
      <div className="max-w-7xl mx-auto">
        <PortfolioStrip stats={{
          totalCredits: plantations.reduce((acc, p) => acc + (p.creditsAwarded || 0), 0),
          availableCredits: plantations.filter(p => p.status === 'VERIFIED').reduce((acc, p) => acc + (p.creditsAwarded || 0), 0),
          totalArea: plantations.reduce((acc, p) => acc + (p.areaSqKm || 0), 0).toFixed(1),
          revenue: 0 // Fetch from trades later
        }} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Satellite Analysis Hub */}
            <SatelliteIntelligence plantation={selectedPlantation} />

            {/* My Plantations Table */}
            <div className="glass rounded-xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold">My Active Plantations</h2>
                <button className="text-primary text-sm hover:underline" onClick={fetchPlantations}>Refresh</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-surface text-text-secondary text-xs uppercase">
                    <tr>
                      <th className="px-6 py-4">Plantation Name</th>
                      <th className="px-6 py-4">Location</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Credits</th>
                      <th className="px-6 py-4">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {plantations.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-text-secondary">No plantations found. Start by registering one!</td>
                      </tr>
                    ) : plantations.map((p, i) => (
                      <tr 
                        key={i} 
                        className={`table-row-alt hover:bg-white/5 transition-all cursor-pointer ${selectedPlantation?.id === p.id ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                        onClick={() => setSelectedPlantation(p)}
                      >
                        <td className="px-6 py-4 font-semibold">{p.name}</td>
                        <td className="px-6 py-4 flex items-center gap-2 text-text-secondary text-xs">
                          <MapPin size={12} /> {p.lat.toFixed(4)}, {p.lng.toFixed(4)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                            p.status === 'VERIFIED' ? 'bg-primary/20 text-primary' : 
                            p.status === 'REJECTED' ? 'bg-danger/20 text-danger' : 'bg-info/20 text-info'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-mono">{p.creditsAwarded || '-'}</td>
                        <td className="px-6 py-4">
                          {p.qualityGrade && (
                            <span className="px-2 py-1 rounded-md bg-white/5 text-xs font-bold">{p.qualityGrade}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Upload Panel */}
          <div className="space-y-6">
            <div className="glass p-8 rounded-xl border border-white/10 relative">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Upload size={20} className="text-primary" /> Register Plantation
              </h3>

              <div className="space-y-4">
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files[0])}
                  accept="image/*"
                />
                <label 
                  htmlFor="file-upload"
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 transition-all cursor-pointer group"
                >
                  <div className="p-3 rounded-full bg-white/5 group-hover:bg-primary/20 group-hover:text-primary transition-all">
                    {file ? <CheckCircle className="text-primary" size={32} /> : <TreePine size={32} />}
                  </div>
                  <div className="text-center">
                    <p className="font-bold">{file ? file.name : 'Upload Satellite Image'}</p>
                    <p className="text-xs text-text-secondary mt-1">Drag and drop or click to browse</p>
                  </div>
                </label>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-secondary font-bold">Plantation Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:border-primary outline-none" 
                    placeholder="E.g. Amazon Basin R1" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  {formData.lat && formData.lng && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl overflow-hidden border border-white/10 relative mt-2 bg-black/40 shadow-2xl"
                    >
                        <div className="aspect-video relative bg-[#0A0C10]">
                            <img 
                                src={previewData?.satelliteImage || `https://maps.googleapis.com/maps/api/staticmap?center=${formData.lat},${formData.lng}&zoom=17&size=600x300&maptype=satellite&key=${import.meta.env.VITE_GOOGLE_MAPS_KEY || ''}`} 
                                alt="Location Preview" 
                                className="w-full h-full object-cover opacity-80"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000"; // High-res orbital forest placeholder
                                }}
                            />
                            {isScanning && (
                                <div className="absolute inset-0 bg-primary/20 flex flex-col items-center justify-center backdrop-blur-sm">
                                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2" />
                                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Scanning Grid...</span>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                                <div className="w-32 h-32 border border-primary/40 rounded-full animate-pulse" />
                            </div>
                            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2">
                                <MapPin size={12} className="text-primary" />
                                <span className="text-[10px] font-bold text-white truncate max-w-[200px]">{locationName || 'Detecting Area...'}</span>
                            </div>
                        </div>

                        {previewData && (
                            <div className="p-4 bg-primary/10 border-t border-white/10 flex items-center justify-between">
                                <div>
                                    <p className="text-[9px] font-black text-text-secondary uppercase">Vegetation Index (NDVI)</p>
                                    <p className="text-xl font-black text-primary">{(previewData.ndviValue * 100).toFixed(1)}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-text-secondary uppercase">Confidence</p>
                                    <p className="text-sm font-bold text-info">96.8%</p>
                                </div>
                            </div>
                        )}
                        
                        {!previewData && !isScanning && (
                            <button 
                                onClick={scanSatellite}
                                className="absolute bottom-4 right-4 bg-primary text-background text-[10px] font-black uppercase px-4 py-2 rounded-lg shadow-glow-green hover:scale-105 transition-all"
                            >
                                Start Orbital Scan
                            </button>
                        )}
                    </motion.div>
                )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-text-secondary font-bold flex items-center justify-between">
                        Latitude
                        <button onClick={detectLocation} className="text-primary hover:underline lowercase font-normal italic">Auto-Detect</button>
                    </label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:border-primary outline-none" 
                      placeholder="30.3165" 
                      value={formData.lat}
                      onChange={(e) => setFormData({...formData, lat: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase text-text-secondary font-bold">Longitude</label>
                    <input 
                      type="text" 
                      className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:border-primary outline-none" 
                      placeholder="78.0322" 
                      value={formData.lng}
                      onChange={(e) => setFormData({...formData, lng: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase text-text-secondary font-bold">Area (Sq Km)</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2 text-sm focus:border-primary outline-none" 
                    placeholder="1.25" 
                    value={formData.areaSqKm}
                    onChange={(e) => setFormData({...formData, areaSqKm: e.target.value})}
                  />
                </div>

                <button 
                  onClick={handleUpload}
                  className="btn-primary w-full py-3 mt-4"
                >
                  Initialize Analysis
                </button>
              </div>

              {/* Live Status Tracker */}
              <AnimatePresence>
                {uploadStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-8 pt-8 border-t border-white/10 space-y-6"
                  >
                    {[
                      { step: 'Uploading Data', status: uploadStatus === 'uploading' ? 'active' : 'done', icon: Upload },
                      { step: 'Satellite Analysis', status: uploadStatus === 'analysis' ? 'active' : uploadStatus === 'complete' ? 'done' : 'pending', icon: Clock },
                      { step: 'Carbon Minting', status: uploadStatus === 'complete' ? 'done' : 'pending', icon: TreePine },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          s.status === 'done' ? 'bg-primary/20 text-primary' : 
                          s.status === 'active' ? 'bg-info/20 text-info animate-pulse' : 
                          'bg-white/5 text-text-secondary'
                        }`}>
                          <s.icon size={16} />
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm font-bold ${s.status === 'pending' ? 'text-text-secondary' : 'text-text-primary'}`}>
                            {s.step}
                          </p>
                          <div className="w-full h-1 bg-white/5 mt-2 rounded-full overflow-hidden">
                            <motion.div 
                              className={`h-full ${s.status === 'done' ? 'bg-primary' : s.status === 'active' ? 'bg-info' : 'bg-transparent'}`}
                              initial={{ width: 0 }}
                              animate={{ width: s.status === 'done' ? '100%' : s.status === 'active' ? '60%' : '0%' }}
                            />
                          </div>
                        </div>
                        {s.status === 'done' && <CheckCircle size={16} className="text-primary" />}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NGODashboard;
