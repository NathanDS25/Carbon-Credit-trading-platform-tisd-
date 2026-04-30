import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { Calendar as CalendarIcon, Video, Clock, ExternalLink, Plus } from 'lucide-react';

const MeetingsTerminal = () => {
  const role = localStorage.getItem('userRole') || 'NGO';
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await api.get('/meetings');
      setMeetings(response.data.data);
    } catch (error) {
      console.error("Failed to fetch meetings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black">Meetings & Verifications</h2>
            <p className="text-text-secondary text-sm">Schedule and join video calls with your network</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} /> Schedule New
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} className="text-primary" /> Upcoming
            </h3>
            
            <div className="space-y-4">
              {meetings.length === 0 ? (
                <div className="p-12 text-center text-text-secondary glass rounded-2xl">
                  No upcoming meetings.
                </div>
              ) : meetings.map((m, i) => (
                <div key={i} className="glass p-6 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex gap-6 items-center">
                    <div className={`p-4 rounded-xl ${m.status === 'CONFIRMED' ? 'bg-primary/20 text-primary' : 'bg-surface text-text-secondary'} shadow-lg`}>
                      <Video size={24} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{m.status === 'CONFIRMED' ? 'Verified Meeting' : 'Verification Inquiry'}</h4>
                      <p className="text-sm text-text-secondary">with {m.participant?.name || m.organizer?.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-text-secondary">
                          <CalendarIcon size={12} /> {new Date(m.scheduledAt).toLocaleString()}
                        </span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          m.status === 'CONFIRMED' ? 'bg-primary text-background' : 
                          m.status === 'PENDING' ? 'bg-info text-background' : 'bg-white/10 text-text-secondary'
                        }`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {m.meetLink && (
                    <a 
                      href={m.meetLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="p-3 rounded-lg bg-primary/10 text-primary hover:bg-primary hover:text-background transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Mini-View Placeholder */}
          <div className="glass rounded-2xl border border-white/5 p-8 flex flex-col items-center justify-center text-center space-y-4 min-h-[400px]">
            <div className="p-6 rounded-full bg-surface">
              <CalendarIcon size={64} className="text-text-secondary opacity-20" />
            </div>
            <h3 className="text-xl font-bold">Interactive Calendar</h3>
            <p className="text-text-secondary text-sm max-w-xs">
              Sync with Google Calendar or Outlook to manage your verification schedule across all devices.
            </p>
            <button className="text-primary font-bold text-sm hover:underline">Connect Calendar →</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MeetingsTerminal;
