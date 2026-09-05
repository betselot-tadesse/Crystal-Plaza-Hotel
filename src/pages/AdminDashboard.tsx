import React, { useState, useEffect, useMemo } from 'react';
import { 
  subscribeToInquiries, 
  updateInquiry, 
  deleteInquiry, 
  createInquiry,
  seedSampleInquiriesIfEmpty,
  InquiryRecord, 
  TargetDepartment, 
  InquiryStatus 
} from '../services/inquiryService';
import { HOTEL_CONFIG } from '../data/hotelConfig';
import { 
  Users, 
  Phone, 
  MessageCircle, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Search, 
  Download, 
  Plus, 
  RefreshCw, 
  ArrowRightLeft, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  ShieldCheck, 
  Lock, 
  Bell, 
  Building2, 
  Utensils, 
  Calendar, 
  Globe, 
  Eye, 
  Check, 
  X,
  Send
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, detail?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  // Authentication & Access state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('crystal_admin_auth') === 'true';
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  // Main state
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'leads' | 'settings' | 'test'>('leads');

  // Filters & Search
  const [departmentFilter, setDepartmentFilter] = useState<'All' | TargetDepartment>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | InquiryStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Inquiry for Detailed Note / Modal
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryRecord | null>(null);
  const [noteDraft, setNoteDraft] = useState('');

  // Manual Add Lead Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadMessage, setNewLeadMessage] = useState('');
  const [newLeadDept, setNewLeadDept] = useState<TargetDepartment>('Reception');

  // Website Settings State (Saved in LocalStorage for persistence across sessions)
  const [announcementText, setAnnouncementText] = useState(() => {
    return localStorage.getItem('crystal_announcement') || 'Special Corporate & Long-Stay Rates available. Contact Reception for direct discounts.';
  });
  const [isAnnouncementActive, setIsAnnouncementActive] = useState(() => {
    return localStorage.getItem('crystal_announcement_active') === 'true';
  });
  const [settingsSavedMessage, setSettingsSavedMessage] = useState('');

  // Subscribe to real-time inquiries from Firestore
  useEffect(() => {
    seedSampleInquiriesIfEmpty();

    const unsubscribe = subscribeToInquiries(
      (data) => {
        setInquiries(data);
        setIsLoading(false);
      },
      (err) => {
        console.warn('Realtime subscription error:', err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Filtered inquiries calculation
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      // Department filter
      if (departmentFilter !== 'All' && inq.targetDepartment !== departmentFilter) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'All' && inq.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (inq.fullName || '').toLowerCase().includes(q);
        const matchPhone = (inq.phone || '').toLowerCase().includes(q);
        const matchMsg = (inq.message || '').toLowerCase().includes(q);
        const matchNotes = (inq.notes || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchMsg && !matchNotes) {
          return false;
        }
      }
      return true;
    });
  }, [inquiries, departmentFilter, statusFilter, searchQuery]);

  // Metric counts
  const metrics = useMemo(() => {
    const total = inquiries.length;
    const reception = inquiries.filter((i) => i.targetDepartment === 'Reception').length;
    const roomService = inquiries.filter((i) => i.targetDepartment === 'Room Service').length;
    const banquet = inquiries.filter((i) => i.targetDepartment === 'Banquets & Dining').length;
    const newLeads = inquiries.filter((i) => i.status === 'new').length;
    const contacted = inquiries.filter((i) => i.status === 'contacted' || i.status === 'resolved').length;

    return { total, reception, roomService, banquet, newLeads, contacted };
  }, [inquiries]);

  // Handle PIN authentication (Default hotel staff PIN: 2026 or crystal2026)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === '2026' || pinInput.trim().toLowerCase() === 'crystal' || pinInput.trim().toLowerCase() === 'crystal2026') {
      setIsAuthenticated(true);
      localStorage.setItem('crystal_admin_auth', 'true');
      setPinError('');
    } else {
      setPinError('Invalid Admin PIN. (Hint: Use default hotel staff PIN: 2026)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('crystal_admin_auth');
  };

  // Status changer
  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    await updateInquiry(id, { status: newStatus });
  };

  // Department Re-routing
  const handleDepartmentReroute = async (id: string, newDept: TargetDepartment) => {
    await updateInquiry(id, { targetDepartment: newDept });
  };

  // Save staff notes
  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    await updateInquiry(selectedInquiry.id, { notes: noteDraft });
    setSelectedInquiry(null);
  };

  // Delete lead
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this lead record?')) {
      await deleteInquiry(id);
    }
  };

  // Export leads to CSV
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      alert('No leads available to export.');
      return;
    }

    const headers = ['ID', 'Date', 'Full Name', 'Phone', 'Target Department', 'Status', 'Source', 'Message', 'Staff Notes'];
    const rows = filteredInquiries.map((inq) => [
      inq.id,
      new Date(inq.createdAt).toLocaleString(),
      `"${(inq.fullName || '').replace(/"/g, '""')}"`,
      `"${(inq.phone || '').replace(/"/g, '""')}"`,
      inq.targetDepartment,
      inq.status,
      inq.source,
      `"${(inq.message || '').replace(/"/g, '""')}"`,
      `"${(inq.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `crystal_plaza_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Create Manual Lead
  const handleCreateManualLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName.trim() || !newLeadPhone.trim()) {
      alert('Please provide guest name and phone number.');
      return;
    }

    await createInquiry({
      fullName: newLeadName,
      phone: newLeadPhone,
      message: newLeadMessage,
      targetDepartment: newLeadDept,
      source: 'admin_manual_entry'
    });

    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadMessage('');
    setIsAddModalOpen(false);
  };

  // Test Lead Generators
  const handleTriggerTestLead = async (dept: TargetDepartment) => {
    const randomGuests = [
      { name: 'Khalid Al Mansoori', phone: '+971 50 112 3456' },
      { name: 'Elena Rostova', phone: '+971 55 984 2133' },
      { name: 'Rajesh Kumar', phone: '+971 52 873 4012' },
      { name: 'Hassan Bin Zayed', phone: '+971 56 429 8810' }
    ];
    const guest = randomGuests[Math.floor(Math.random() * randomGuests.length)];
    
    let msg = '';
    if (dept === 'Reception') {
      msg = 'Checking if 1 Standard Twin Room is available for 2 nights with late check-out.';
    } else if (dept === 'Room Service') {
      msg = 'Ordering late-night room service: 2 Club Sandwiches, French Fries, and Fresh Orange Juice to Room 304.';
    } else {
      msg = 'Banquet hall pricing inquiry for 75 guests gathering next Friday afternoon.';
    }

    await createInquiry({
      fullName: guest.name,
      phone: guest.phone,
      message: msg,
      targetDepartment: dept,
      source: `simulated_test_${dept.toLowerCase().replace(/\s+/g, '_')}`
    });
  };

  // Save website settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('crystal_announcement', announcementText);
    localStorage.setItem('crystal_announcement_active', String(isAnnouncementActive));
    setSettingsSavedMessage('Website settings successfully saved!');
    setTimeout(() => setSettingsSavedMessage(''), 3000);
  };

  // Render Lock Screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#0A192F] border border-[#C5A059]/30 rounded-2xl p-8 shadow-2xl text-white">
          <div className="text-center space-y-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center mx-auto text-[#C5A059]">
              <Lock className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold uppercase tracking-wider text-white">
              <span className="text-[#C5A059]">Crystal Plaza</span> Admin
            </h1>
            <p className="text-xs text-slate-300">
              Staff & Management Portal • Lead Routing & Website Control
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Enter Staff PIN / Password
              </label>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                autoFocus
                required
                className="w-full text-center tracking-widest text-lg p-3 rounded-lg border border-slate-700 bg-slate-900/90 text-white focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
              />
            </div>

            {pinError && (
              <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-lg text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#C5A059] hover:bg-[#B38E47] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer transition-all active:scale-98"
            >
              Sign In to Admin Console
            </button>

            <div className="pt-3 text-center border-t border-slate-800">
              <button
                type="button"
                onClick={() => onNavigate('home')}
                className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ← Return to Public Guest Website
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40 px-4 sm:px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={HOTEL_CONFIG.LOGO_URL}
              alt="Crystal Plaza Hotel"
              className="w-9 h-9 rounded-full object-cover border border-[#C5A059]"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-white tracking-wide">
                  <span className="text-[#C5A059]">Crystal Plaza</span> Admin Console
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  LIVE DB
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Sharjah Central • Department Routing: Reception • Room Service • Banquets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('home')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>View Guest Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-900/50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock / Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6 flex-grow">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <span>Total Inquiries</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-white">{metrics.total}</div>
            <div className="text-[10px] text-slate-400 mt-1">Recorded in Database</div>
          </div>

          {/* Reception */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-900/40 shadow-sm">
            <div className="flex items-center justify-between text-blue-400 text-xs font-semibold uppercase tracking-wider">
              <span>Reception Desk</span>
              <Building2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-blue-300">{metrics.reception}</div>
            <div className="text-[10px] text-slate-400 mt-1">Rooms & Front Desk ({HOTEL_CONFIG.PHONE_NUMBER})</div>
          </div>

          {/* Room Service / Dining */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-900/40 shadow-sm">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <span>Room Service</span>
              <Utensils className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">{metrics.roomService}</div>
            <div className="text-[10px] text-slate-400 mt-1">Dining & In-room ({HOTEL_CONFIG.ROOM_SERVICE_DISPLAY})</div>
          </div>

          {/* Banquets & Dining */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-900/40 shadow-sm">
            <div className="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <span>Banquets & Events</span>
              <Calendar className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold text-amber-300">{metrics.banquet}</div>
            <div className="text-[10px] text-slate-400 mt-1">Halls & Meetings ({HOTEL_CONFIG.EVENTS_DINING_DISPLAY})</div>
          </div>

          {/* Pending New Leads */}
          <div className="bg-slate-950 p-4 rounded-xl border border-purple-900/40 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-between text-purple-400 text-xs font-semibold uppercase tracking-wider">
              <span>New / Unhandled</span>
              <Bell className="w-4 h-4 text-purple-400 animate-pulse" />
            </div>
            <div className="mt-2 text-2xl font-bold text-purple-300">{metrics.newLeads}</div>
            <div className="text-[10px] text-slate-400 mt-1">Needs immediate follow-up</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('leads')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'leads'
                  ? 'bg-[#C5A059] text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Leads & Inquiries Tracker</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-900/40 text-[10px] ml-1">
                {filteredInquiries.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'settings'
                  ? 'bg-[#C5A059] text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Website & Department Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
                activeTab === 'test'
                  ? 'bg-[#C5A059] text-slate-950 shadow'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Test Department Routing</span>
            </button>
          </div>

          {activeTab === 'leads' && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log Walk-in / Call</span>
              </button>
            </div>
          )}
        </div>

        {/* TAB 1: Leads & Inquiries Tracker */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              {/* Department Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Department:</span>
                {(['All', 'Reception', 'Room Service', 'Banquets & Dining'] as const).map((dept) => (
                  <button
                    key={dept}
                    onClick={() => setDepartmentFilter(dept)}
                    className={`px-3 py-1 rounded-md transition-colors cursor-pointer font-medium ${
                      departmentFilter === dept
                        ? 'bg-slate-700 text-white border border-slate-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {dept === 'All' ? 'All' : dept}
                  </button>
                ))}
              </div>

              {/* Status Filter */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-400 font-semibold mr-1">Status:</span>
                {(['All', 'new', 'in_progress', 'contacted', 'resolved'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer capitalize font-medium ${
                      statusFilter === st
                        ? 'bg-slate-700 text-white border border-slate-500'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    {st === 'All' ? 'All' : st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div className="relative flex-grow max-w-xs">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search name, phone, message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                />
              </div>
            </div>

            {/* Inquiries List */}
            {isLoading ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C5A059]" />
                Connecting to live database...
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-slate-950 p-12 text-center rounded-xl border border-slate-800 text-slate-400 space-y-3">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <h3 className="text-sm font-semibold text-slate-300">No Inquiries Matching Filters</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try switching department or status filters, or use the test tool to send a live test lead.
                </p>
                <button
                  onClick={() => { setDepartmentFilter('All'); setStatusFilter('All'); setSearchQuery(''); }}
                  className="text-xs text-[#C5A059] hover:underline"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInquiries.map((inq) => {
                  const isReception = inq.targetDepartment === 'Reception';
                  const isRoomService = inq.targetDepartment === 'Room Service';
                  const isBanquet = inq.targetDepartment === 'Banquets & Dining';

                  const deptColor = isReception 
                    ? 'bg-blue-950/80 text-blue-300 border-blue-800' 
                    : isRoomService 
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' 
                    : 'bg-amber-950/80 text-amber-300 border-amber-800';

                  const deptIcon = isReception ? (
                    <Building2 className="w-3.5 h-3.5" />
                  ) : isRoomService ? (
                    <Utensils className="w-3.5 h-3.5" />
                  ) : (
                    <Calendar className="w-3.5 h-3.5" />
                  );

                  // WhatsApp quick link URL
                  const cleanPhone = (inq.phone || '').replace(/[^0-9]/g, '');
                  const waCustomerUrl = cleanPhone 
                    ? `https://wa.me/${cleanPhone.startsWith('971') ? cleanPhone : '971' + cleanPhone.replace(/^0+/, '')}?text=${encodeURIComponent(
                        `Hello ${inq.fullName}, thank you for contacting Crystal Plaza Hotel. We have received your inquiry regarding ${inq.targetDepartment}. How can we assist you today?`
                      )}`
                    : null;

                  return (
                    <div
                      key={inq.id}
                      className="bg-slate-950 p-4 sm:p-5 rounded-xl border border-slate-800/90 hover:border-slate-700 transition-all shadow-sm space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {/* Department Destination Badge */}
                          <div className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${deptColor}`}>
                            {deptIcon}
                            <span>{inq.targetDepartment}</span>
                          </div>

                          {/* Status Badge */}
                          <select
                            value={inq.status}
                            onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                            className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border focus:outline-none cursor-pointer ${
                              inq.status === 'new'
                                ? 'bg-purple-950 text-purple-300 border-purple-800'
                                : inq.status === 'in_progress'
                                ? 'bg-amber-950 text-amber-300 border-amber-800'
                                : inq.status === 'contacted'
                                ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                            }`}
                          >
                            <option value="new">● New Lead</option>
                            <option value="in_progress">● In Progress</option>
                            <option value="contacted">● Contacted</option>
                            <option value="resolved">● Resolved</option>
                          </select>

                          {/* Source badge */}
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider hidden sm:inline">
                            Via: {inq.source}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(inq.createdAt).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Guest Details & Message */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start pt-1">
                        <div className="md:col-span-4 space-y-1">
                          <div className="font-bold text-white text-sm sm:text-base">
                            {inq.fullName}
                          </div>
                          <div className="text-xs text-slate-300 flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                            <a href={`tel:${inq.phone}`} className="hover:text-amber-400 font-mono">
                              {inq.phone}
                            </a>
                          </div>
                        </div>

                        <div className="md:col-span-8 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                          <span className="font-semibold text-slate-400 block mb-1">Inquiry Details:</span>
                          <p className="whitespace-pre-wrap">{inq.message || 'No specific text entered.'}</p>

                          {inq.notes && (
                            <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                              <Edit3 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-amber-400">Staff Note:</strong> {inq.notes}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="pt-2 border-t border-slate-850 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Re-route Dropdown */}
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500" />
                            <span>Route to:</span>
                            <select
                              value={inq.targetDepartment}
                              onChange={(e) => handleDepartmentReroute(inq.id, e.target.value as TargetDepartment)}
                              className="text-xs bg-slate-900 text-slate-200 border border-slate-700 rounded px-2 py-1 focus:outline-none"
                            >
                              <option value="Reception">Reception</option>
                              <option value="Room Service">Room Service</option>
                              <option value="Banquets & Dining">Banquets & Dining</option>
                            </select>
                          </div>

                          {/* Notes button */}
                          <button
                            onClick={() => {
                              setSelectedInquiry(inq);
                              setNoteDraft(inq.notes || '');
                            }}
                            className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-[#C5A059]" />
                            <span>{inq.notes ? 'Edit Notes' : 'Add Note'}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* WhatsApp Customer */}
                          {waCustomerUrl && (
                            <a
                              href={waCustomerUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp Guest</span>
                            </a>
                          )}

                          {/* Direct Call */}
                          <a
                            href={`tel:${inq.phone}`}
                            className="px-3 py-1 rounded bg-slate-900 text-slate-200 border border-slate-800 hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                            <span>Call</span>
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(inq.id)}
                            className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Delete Lead"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Website & Department Settings */}
        {activeTab === 'settings' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 max-w-4xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C5A059]" />
                <span>Hotel Website & Routing Configuration</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Configure official hotel hotlines, operational routing, and guest announcement banners.
              </p>
            </div>

            {settingsSavedMessage && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{settingsSavedMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Department Contact Directory */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Verified Department Hotlines (Al Qasimia, Sharjah)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-blue-400">
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        Reception Desk & Room Booking
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Phone:</strong> {HOTEL_CONFIG.PHONE_NUMBER}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>WhatsApp:</strong> +{HOTEL_CONFIG.WHATSAPP_NUMBER}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Receives inquiries from Room Booking modal, general contact, and arrival enquiries.
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-emerald-400">
                      <span className="flex items-center gap-1.5">
                        <Utensils className="w-4 h-4" />
                        Room Service & Dining
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Phone:</strong> {HOTEL_CONFIG.ROOM_SERVICE_DISPLAY}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>WhatsApp:</strong> +{HOTEL_CONFIG.ROOM_SERVICE_WHATSAPP}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Receives inquiries from in-room dining, midnight snack orders, and buffet restaurant queries.
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-amber-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        Banquet Hall & Event Planner
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Phone:</strong> {HOTEL_CONFIG.EVENTS_DINING_DISPLAY}
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>WhatsApp:</strong> +{HOTEL_CONFIG.EVENTS_DINING_WHATSAPP}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Receives inquiries from Home page banquet form, Event quote form, and Corporate seminars.
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-purple-400">
                      <span className="flex items-center gap-1.5">
                        <Globe className="w-4 h-4" />
                        Official Booking Engine
                      </span>
                    </div>
                    <div className="text-xs text-slate-300">
                      <strong>Partner:</strong> Agoda Official Channel
                    </div>
                    <div className="text-xs text-slate-300 truncate">
                      <strong>URL:</strong> {HOTEL_CONFIG.AGODA_URL}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Synchronized with Sharjah central live availability without complex credit-card gateway setup.
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Announcement Banner Setting */}
              <div className="p-5 bg-slate-900 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      Guest Website Announcement Banner
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Display a top alert bar for special promotions, Ramadan offers, or group discounts.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnnouncementActive}
                      onChange={(e) => setIsAnnouncementActive(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C5A059]"></div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Banner Content:
                  </label>
                  <textarea
                    rows={2}
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
                    placeholder="Enter announcement text to display across the website..."
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#B38E47] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-lg shadow transition-all cursor-pointer"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: Test Department Routing */}
        {activeTab === 'test' && (
          <div className="bg-slate-950 p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 max-w-4xl">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Send className="w-5 h-5 text-[#C5A059]" />
                <span>Simulate & Test Department Lead Routing</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any of the buttons below to generate a realistic test inquiry. It will immediately record into the Firestore database, update the counters, and route to the selected department!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Test Reception */}
              <div className="p-5 bg-slate-900 rounded-xl border border-blue-900/50 space-y-3">
                <div className="flex items-center gap-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  <span>Reception Desk Lead</span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulates a guest submitting a room reservation enquiry for 2 nights with early check-in.
                </p>
                <button
                  onClick={() => handleTriggerTestLead('Reception')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Send Test to Reception
                </button>
              </div>

              {/* Test Room Service */}
              <div className="p-5 bg-slate-900 rounded-xl border border-emerald-900/50 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Utensils className="w-4 h-4" />
                  <span>Room Service Lead</span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulates an in-room dining request for club sandwiches and refreshments to Room 304.
                </p>
                <button
                  onClick={() => handleTriggerTestLead('Room Service')}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Send Test to Room Service
                </button>
              </div>

              {/* Test Banquets */}
              <div className="p-5 bg-slate-900 rounded-xl border border-amber-900/50 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <Calendar className="w-4 h-4" />
                  <span>Banquet Hall Lead</span>
                </div>
                <p className="text-xs text-slate-400">
                  Simulates a corporate or wedding inquiry for 75 guests in the Al Qasimia banquet hall.
                </p>
                <button
                  onClick={() => handleTriggerTestLead('Banquets & Dining')}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Send Test to Banquets
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-[#C5A059]">Pro-Tip:</span> Switch back to the{' '}
              <strong className="text-white">Leads & Inquiries Tracker</strong> tab after clicking to see the new lead appear instantly via Firestore real-time listener!
            </div>
          </div>
        )}
      </div>

      {/* Staff Note Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C5A059]" />
                <span>Staff Follow-Up Notes: {selectedInquiry.fullName}</span>
              </h3>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Internal Remarks / Booking Follow-up Log:
              </label>
              <textarea
                rows={4}
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="e.g. Spoke with guest, offered 15% discount for 3-night stay. Awaiting confirmation."
                className="w-full text-xs p-3 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#C5A059]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-4 py-2 rounded-lg bg-[#C5A059] hover:bg-[#B38E47] text-slate-950 font-bold text-xs uppercase tracking-wider cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <span>Log Walk-in Guest or Phone Lead</span>
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateManualLead} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guest Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mansoor"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contact Phone (with WhatsApp) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +971 50 123 4567"
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Department *
                </label>
                <select
                  value={newLeadDept}
                  onChange={(e) => setNewLeadDept(e.target.value as TargetDepartment)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="Reception">Reception Desk (Rooms & Front Office)</option>
                  <option value="Room Service">Room Service (Food & Dining)</option>
                  <option value="Banquets & Dining">Banquets & Events</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Inquiry Message / Request
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter guest requests, dates, or remarks..."
                  value={newLeadMessage}
                  onChange={(e) => setNewLeadMessage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-700 bg-slate-950 text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
