import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import socket from '../../utils/socket';

const pageTitles = {
  '/dashboard': 'Executive Solar Dashboard',
  '/leads': 'Solar Lead Management',
  '/customers': 'Customer & Project Records',
  '/site-surveys': 'Technical Site Survey & Feasibility',
  '/quotations': 'Solar Quotation & System Estimator',
  '/orders': 'Solar Order Management & Bookings',
  '/installations': 'Installation & Commissioning BOS',
  '/subsidy': 'PM Surya Ghar / National Portal Subsidy',
  '/payments': 'Payment Ledger & Milestones',
  '/services': 'Solar Complaints & AMC Service',
  '/dealers': 'Channel Partners & Dealer Network',
  '/reports': 'Solar MIS Reports & Analytics',
  '/settings': 'System Settings & Branding',
};

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loginRequest, setLoginRequest] = useState(null); // { email, requestSocketId }
  const { pathname } = useLocation();
  const { currentUser } = useAuth();
  const title = Object.entries(pageTitles).find(([k]) => pathname.startsWith(k))?.[1] || 'LeadFlow CRM';

  // Register this device's socket + listen for login requests
  useEffect(() => {
    if (!currentUser?.email) return;
    socket.connect();
    socket.emit('register', currentUser.email);

    socket.on('login_request', ({ email, requestSocketId }) => {
      setLoginRequest({ email, requestSocketId });
    });

    return () => {
      socket.off('login_request');
    };
  }, [currentUser?.email]);

  const handleApprove = () => {
    socket.emit('login_approve', loginRequest);
    setLoginRequest(null);
  };

  const handleReject = () => {
    socket.emit('login_reject', loginRequest);
    setLoginRequest(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex selection:bg-[#22C55E] selection:text-white print:bg-white print:m-0 print:p-0">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0 print:ml-0 print:m-0 print:p-0">
        <Navbar onMenuClick={() => setSidebarOpen(true)} pageTitle={title} />
        <main className="flex-1 p-4 lg:p-6 overflow-auto relative min-h-[calc(100vh-4rem)] print:p-0 print:m-0 print:overflow-visible">
          <Outlet />
        </main>
      </div>

      {/* Login approval notification */}
      {loginRequest && (
        <div className="fixed top-4 right-4 z-[100] w-80 bg-white border border-orange-200 rounded-2xl shadow-2xl p-5 animate-in">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-lg">🔐</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Naya Login Request</p>
              <p className="text-xs text-gray-500 mt-0.5">
                <strong>{loginRequest.email}</strong> kisi doosre device se login karne ki koshish kar raha hai.
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mb-4">Kya aap is login ko allow karna chahte hain? Allow karne par aapka current session band ho jaayega.</p>
          <div className="flex gap-2">
            <button onClick={handleReject}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
              Ignore
            </button>
            <button onClick={handleApprove}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors">
              Allow Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
