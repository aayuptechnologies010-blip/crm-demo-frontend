import { useState, useRef, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Share2, 
  Printer, 
  Sun, 
  Zap, 
  CheckCircle2, 
  Building2, 
  Phone, 
  Mail, 
  Plus, 
  IndianRupee, 
  ShieldCheck,
  Send,
  Sparkles,
  Search,
  UserCheck,
  ChevronDown,
  X
} from 'lucide-react';
import { SAMPLE_SOLAR_PROJECTS, SAMPLE_SOLAR_LEADS } from '../data/solarData';

export default function SolarQuotation() {
  // Merge customer sources for comprehensive lookup
  const customerDatabase = [
    ...SAMPLE_SOLAR_PROJECTS.map(p => ({
      id: p.projectId,
      name: p.customerName,
      mobile: p.mobile,
      email: `${p.customerName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      address: p.address,
      district: p.district,
      consumerNo: p.consumerNumber,
      capacityKw: parseInt(p.solarCapacity) || 5,
      panelBrand: p.panelBrand || 'Waaree 550W Mono PERC Bifacial TopCon',
      inverterBrand: p.inverterBrand || 'Growatt 5kW 3-Phase Grid Tie',
      structureType: p.structureType || 'Elevated HDG Structure (South Facing 22°)'
    })),
    ...SAMPLE_SOLAR_LEADS.map(l => ({
      id: l.id,
      name: l.customerName,
      mobile: l.mobile,
      email: `${l.customerName.toLowerCase().replace(/[^a-z]/g, '')}@gmail.com`,
      address: l.location,
      district: l.district,
      consumerNo: l.consumerNumber,
      capacityKw: parseInt(l.requiredKw) || 3,
      panelBrand: 'Waaree 550W Mono PERC Bifacial TopCon',
      inverterBrand: 'Growatt 5kW 3-Phase Grid Tie',
      structureType: 'Elevated HDG Structure (South Facing 22°)'
    }))
  ];

  const [customer, setCustomer] = useState({
    name: 'Rajendra Prasad Sharma',
    mobile: '9876543210',
    email: 'rajendra.sharma@gmail.com',
    address: 'Plot 45, Sector B, Aliganj',
    district: 'Lucknow',
    consumerNo: 'PU-78392104'
  });

  const [capacityKw, setCapacityKw] = useState(5);
  const [panelBrand, setPanelBrand] = useState('Waaree 550W Mono PERC Bifacial TopCon');
  const [panelCount, setPanelCount] = useState(9);
  const [inverterBrand, setInverterBrand] = useState('Growatt 5kW 3-Phase Grid Tie');
  const [structureType, setStructureType] = useState('Elevated HDG Structure (South Facing 22°)');
  const [ratePerKw, setRatePerKw] = useState(52000);
  const [installationCharges, setInstallationCharges] = useState(12000);
  const [otherCharges, setOtherCharges] = useState(8000); // Liaisoning, Earthing & Cabling

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = customerDatabase.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.mobile.includes(q) ||
      c.consumerNo.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q) ||
      c.district.toLowerCase().includes(q)
    );
  });

  const handleSelectCustomer = (selected) => {
    setCustomer({
      name: selected.name,
      mobile: selected.mobile,
      email: selected.email,
      address: selected.address,
      district: selected.district,
      consumerNo: selected.consumerNo
    });
    setCapacityKw(selected.capacityKw);
    setPanelCount(Math.ceil((selected.capacityKw * 1000) / 550));
    if (selected.panelBrand) setPanelBrand(selected.panelBrand);
    if (selected.inverterBrand) setInverterBrand(selected.inverterBrand);
    if (selected.structureType) setStructureType(selected.structureType);
    setSearchQuery(`${selected.name} (${selected.consumerNo})`);
    setIsDropdownOpen(false);
  };

  // Calculations
  const solarPlantBase = capacityKw * ratePerKw;
  const subtotalBeforeTax = solarPlantBase + Number(installationCharges) + Number(otherCharges);
  const gstAmount = Math.round(subtotalBeforeTax * 0.138); // Standard composite solar tax (13.8%)
  const totalAmount = subtotalBeforeTax + gstAmount;

  // PM Surya Ghar Subsidy calculation
  // 1 kW = 30,000 | 2 kW = 60,000 | 3 kW and above = 78,000 max central subsidy
  const subsidyAmount = capacityKw === 1 ? 30000 : capacityKw === 2 ? 60000 : 78000;
  const customerPayableAmount = Math.max(0, totalAmount - subsidyAmount);

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const text = `*DEVAGYADI BHARAT PRIVATE LIMITED*\n*Solar Rooftop Quotation*\n\nNamaste ${customer.name} ji,\nAapka *${capacityKw} kW* Solar Proposal ready hai:\n\n• Panel: ${panelBrand}\n• Inverter: ${inverterBrand}\n• Total Amount: ₹${totalAmount.toLocaleString('en-IN')}\n• PM Surya Ghar Subsidy: -₹${subsidyAmount.toLocaleString('en-IN')}\n• *Net Customer Payable: ₹${customerPayableAmount.toLocaleString('en-IN')}*\n\nPDF Proposal download karne aur subsidy claim process karne ke liye sampark karein:\n📞 +91 9876543210 | info@devagyadibharat.com`;
    window.open(`https://wa.me/91${customer.mobile}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = `Official Solar Quotation - ${capacityKw}kW Rooftop Plant | Devagyadi Bharat`;
    const body = `Dear ${customer.name},\n\nPlease find your official quotation for ${capacityKw}kW On-Grid Solar Rooftop Plant with PM Surya Ghar Subsidy.\n\nTotal Project Cost: INR ${totalAmount.toLocaleString('en-IN')}\nCentral Government Subsidy: INR ${subsidyAmount.toLocaleString('en-IN')}\nNet Customer Payable Amount: INR ${customerPayableAmount.toLocaleString('en-IN')}\n\nWarm regards,\nDevagyadi Bharat Private Limited\nHazratganj, Lucknow`;
    window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="space-y-6">
      {/* Configuration Header / Controls */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs print:hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Sun className="text-[#166534]" size={24} /> Solar Quotation Generator (4.E)
            </h1>
            <p className="text-xs text-slate-500">
              Generate professional quotation, PM Surya Ghar subsidy breakdown, PDF download & WhatsApp / Email share
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-xs">
              <Download size={15} /> Download PDF / Print
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all shadow-xs">
              <Share2 size={15} /> Share on WhatsApp
            </button>
            <button
              onClick={handleEmailShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#166534] hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-xs">
              <Mail size={15} /> Send via Email
            </button>
          </div>
        </div>

        {/* Search Customer Filter Box */}
        <div ref={dropdownRef} className="relative bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <label className="block text-xs font-black text-[#166534] mb-1.5 flex items-center gap-1.5 uppercase tracking-wide">
            <UserCheck size={15} className="text-[#22C55E]" /> Filter & Select Customer (Search by Name, Mobile, Consumer No, or Project ID)
          </label>
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Type customer name, phone number, consumer ID (e.g. PU-12093485) or Project ID..."
              value={searchQuery}
              onFocus={() => setIsDropdownOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              className="w-full pl-10 pr-24 py-2.5 bg-white border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-[#22C55E] focus:border-[#166534] font-semibold text-slate-800 text-xs shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsDropdownOpen(false);
                }}
                className="absolute right-10 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 hover:text-slate-700">
              <ChevronDown size={16} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Autocomplete Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 max-h-72 overflow-y-auto divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  Koi customer match nahi hua "{searchQuery}".
                </div>
              ) : (
                filteredCustomers.map((cust) => (
                  <div
                    key={`${cust.id}-${cust.consumerNo}`}
                    onClick={() => handleSelectCustomer(cust)}
                    className="p-3 hover:bg-emerald-50/80 cursor-pointer transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#166534] font-black text-xs flex items-center justify-center flex-shrink-0 group-hover:bg-[#166534] group-hover:text-white transition-colors">
                        {cust.name[0]}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 group-hover:text-[#166534] flex items-center gap-2">
                          {cust.name}
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold border border-slate-200">
                            {cust.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <span>📞 +91 {cust.mobile}</span>
                          <span>⚡ {cust.consumerNo}</span>
                          <span>📍 {cust.district}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 pl-3">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-yellow-100 text-yellow-900 text-[10px] font-extrabold border border-yellow-300">
                        {cust.capacityKw} kW
                      </span>
                      <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Click to Fill ⚡</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Real-time Configurator Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Customer Name</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-semibold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Mobile / WhatsApp</label>
            <input
              type="text"
              value={customer.mobile}
              onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-medium"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">System Capacity (kW)</label>
            <select
              value={capacityKw}
              onChange={(e) => {
                const kw = Number(e.target.value);
                setCapacityKw(kw);
                setPanelCount(Math.ceil((kw * 1000) / 550));
              }}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-black text-slate-800">
              <option value={1}>1 kW (Residential)</option>
              <option value={2}>2 kW (Residential)</option>
              <option value={3}>3 kW (Residential)</option>
              <option value={4}>4 kW (Residential)</option>
              <option value={5}>5 kW (Residential / Villa)</option>
              <option value={7}>7 kW (3-Phase Domestic)</option>
              <option value={10}>10 kW (Commercial)</option>
            </select>
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Base Rate / kW (₹)</label>
            <input
              type="number"
              value={ratePerKw}
              onChange={(e) => setRatePerKw(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-bold"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">Installation Charges (₹)</label>
            <input
              type="number"
              value={installationCharges}
              onChange={(e) => setInstallationCharges(Number(e.target.value))}
              className="w-full px-3 py-1.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-300 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* Official Printable Quotation Document (A4 Single-Page Print Ready) */}
      <div 
        id="printable-quotation" 
        className="bg-white rounded-3xl border border-slate-300 shadow-xl max-w-4xl mx-auto p-8 text-slate-800 print:p-0 print:m-0 print:border-none print:shadow-none print:w-full print:max-w-none print:h-full">
        
        {/* Top Content Wrapper */}
        <div className="print:flex-1 print:flex print:flex-col">
          {/* Company Name & Logo */}
          <div className="flex items-start justify-between border-b-2 border-[#166534] pb-4 mb-4 print:pb-3 print:mb-3">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-2xl bg-[#166534] border-2 border-[#22C55E] flex items-center justify-center p-2 text-[#FACC15] shadow-md print:w-13 print:h-13">
                <Sun size={32} className="print:w-7 print:h-7" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-[#166534] tracking-wide uppercase font-display print:text-lg">
                    DEVAGYADI BHARAT PRIVATE LIMITED
                  </h2>
                </div>
                <p className="text-xs font-bold text-emerald-800 print:text-[11px]">
                  MNRE & PM Surya Ghar Registered Rooftop Solar EPC Partner
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 print:text-[9.5px]">
                  Reg. Office: Hazratganj, Lucknow, Uttar Pradesh – 226001 | CIN: U40106UP2024PTC198274
                </p>
                <p className="text-[10px] text-slate-400 print:text-[9px]">
                  Email: info@devagyadibharat.com | Phone: +91 9876543210 | Web: devagyadibharat.com
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-black text-slate-400 uppercase tracking-wider print:text-[10px]">OFFICIAL QUOTATION</div>
              <div className="text-sm font-black text-[#166534] font-mono print:text-sm">#DBPL-QUO-2026-0091</div>
              <div className="text-xs text-slate-500 mt-1 print:text-[10px]">Date: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded mt-1 border border-emerald-200 inline-block print:text-[9px]">
                Valid for: 15 Days
              </div>
            </div>
          </div>

          {/* Customer Details & Solar Capacity */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-4 text-xs print:p-3.5 print:mb-3.5 print:text-[11px] print:rounded-xl">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 print:text-[9.5px]">Customer Details</div>
              <div className="font-black text-sm text-slate-900 print:text-xs">{customer.name}</div>
              <div className="text-slate-600 mt-0.5">{customer.address}, {customer.district}</div>
              <div className="text-slate-600 mt-0.5">Mobile: +91 {customer.mobile}</div>
              <div className="text-slate-600 mt-0.5">Email: {customer.email}</div>
              <div className="text-slate-600 mt-0.5 font-mono">Consumer ID: {customer.consumerNo}</div>
            </div>

            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase mb-1 print:text-[9.5px]">Plant Specifications</div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-[#166534] print:text-xs">⚡ {capacityKw} kW On-Grid Solar Plant</span>
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-200 print:text-[9px]">
                  Net Metering Ready
                </span>
              </div>
              <div className="text-slate-700 mt-1"><strong>Panel Brand:</strong> {panelBrand} ({panelCount} Nos.)</div>
              <div className="text-slate-700 mt-0.5"><strong>Inverter Brand:</strong> {inverterBrand}</div>
              <div className="text-slate-700 mt-0.5"><strong>Structure:</strong> {structureType}</div>
            </div>
          </div>

          {/* Bill of Quantities & Scope of Work */}
          <div className="mb-4 print:mb-3">
            <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2 print:text-[11px] print:mb-1.5">Technical Scope & Supply Breakdown</div>
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden print:text-[10px]">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 print:bg-slate-50">
                <tr>
                  <th className="p-3 print:py-2 print:px-2.5">#</th>
                  <th className="p-3 print:py-2 print:px-2.5">Equipment / Service Description</th>
                  <th className="p-3 print:py-2 print:px-2.5">Specification / Brand</th>
                  <th className="p-3 text-right print:py-2 print:px-2.5">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="p-3 font-semibold print:py-2 print:px-2.5">1</td>
                  <td className="p-3 print:py-2 print:px-2.5">
                    <div className="font-bold text-slate-900 print:text-[10.5px]">Solar PV Modules</div>
                    <div className="text-[11px] text-slate-500 print:text-[9px]">25 Years Linear Performance Warranty</div>
                  </td>
                  <td className="p-3 print:py-2 print:px-2.5">{panelBrand}</td>
                  <td className="p-3 text-right font-semibold print:py-2 print:px-2.5">₹{(capacityKw * ratePerKw).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold print:py-2 print:px-2.5">2</td>
                  <td className="p-3 print:py-2 print:px-2.5">
                    <div className="font-bold text-slate-900 print:text-[10.5px]">Solar On-Grid Inverter</div>
                    <div className="text-[11px] text-slate-500 print:text-[9px]">Wi-Fi Remote Cloud Monitoring included</div>
                  </td>
                  <td className="p-3 print:py-2 print:px-2.5">{inverterBrand}</td>
                  <td className="p-3 text-right font-semibold print:py-2 print:px-2.5">Included</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold print:py-2 print:px-2.5">3</td>
                  <td className="p-3 print:py-2 print:px-2.5">
                    <div className="font-bold text-slate-900 print:text-[10.5px]">Module Mounting Structure</div>
                    <div className="text-[11px] text-slate-500 print:text-[9px]">Wind velocity tested up to 150 km/h</div>
                  </td>
                  <td className="p-3 print:py-2 print:px-2.5">{structureType}</td>
                  <td className="p-3 text-right font-semibold print:py-2 print:px-2.5">Included</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold print:py-2 print:px-2.5">4</td>
                  <td className="p-3 print:py-2 print:px-2.5">
                    <div className="font-bold text-slate-900 print:text-[10.5px]">Installation & Commissioning Charges</div>
                    <div className="text-[11px] text-slate-500 print:text-[9px]">Civil foundation, erection, AC/DC cable dressing</div>
                  </td>
                  <td className="p-3 print:py-2 print:px-2.5">Turnkey Erection by Certified Installers</td>
                  <td className="p-3 text-right font-semibold print:py-2 print:px-2.5">₹{Number(installationCharges).toLocaleString('en-IN')}</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold print:py-2 print:px-2.5">5</td>
                  <td className="p-3 print:py-2 print:px-2.5">
                    <div className="font-bold text-slate-900 print:text-[10.5px]">Other Charges (Earthing, BOS & Net Meter Liaisoning)</div>
                    <div className="text-[11px] text-slate-500 print:text-[9px]">3 Chemical earthing pits, copper LA & DISCOM net-meter documentation</div>
                  </td>
                  <td className="p-3 print:py-2 print:px-2.5">BOS + Liaisoning Support</td>
                  <td className="p-3 text-right font-semibold print:py-2 print:px-2.5">₹{Number(otherCharges).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Cost, Subsidy & Net Customer Payable Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t-2 border-slate-200 pt-3.5 mb-4 print:pt-3 print:mb-3 print:gap-4">
            <div className="text-xs text-slate-500 max-w-sm space-y-1.5 print:text-[10px] print:space-y-1">
              <div className="font-bold text-slate-800 print:text-[10.5px]">Approved Payment Milestones:</div>
              <div>• <strong>20%</strong> Booking Token Advance</div>
              <div>• <strong>70%</strong> Upon Delivery of Solar Panels & Inverter at Site</div>
              <div>• <strong>10%</strong> Upon Net Meter Synchronization & Commissioning</div>
              <div className="pt-1.5 text-[11px] text-[#166534] font-bold flex items-center gap-1.5 print:text-[9.5px]">
                <ShieldCheck size={15} className="text-[#22C55E] flex-shrink-0" /> PM Surya Ghar central subsidy is credited directly to Customer Bank A/c via DBT.
              </div>
            </div>

            <div className="w-full sm:w-80 space-y-1.5 text-xs print:w-80 print:space-y-1.5 print:text-[10.5px]">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal (Equipment + Charges):</span>
                <span className="font-semibold">₹{subtotalBeforeTax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Applicable GST (Composite 13.8%):</span>
                <span className="font-semibold">₹{gstAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                <span>Total Amount:</span>
                <span className="text-sm font-black print:text-sm">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-800 font-extrabold bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 print:py-1">
                <span>PM Surya Ghar Subsidy:</span>
                <span className="font-black text-emerald-700">- ₹{subsidyAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-900 text-sm font-black bg-[#FACC15]/30 px-3 py-2 rounded-xl border border-yellow-300 print:py-1.5 print:text-xs">
                <span>Customer Payable Amount:</span>
                <span className="text-[#166534] font-black text-base print:text-sm">₹{customerPayableAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Terms & Conditions & Signatory - Stays anchored at the bottom */}
        <div className="grid grid-cols-2 gap-4 text-[10px] text-slate-500 pt-3 border-t border-slate-200 print:pt-2 print:text-[9px] print:gap-4 print:mt-auto">
          <div>
            <div className="font-bold text-slate-800 mb-1 uppercase tracking-wider print:text-[9.5px]">Terms & Conditions:</div>
            <ol className="list-decimal pl-3 space-y-0.5">
              <li>Quotation is valid for 15 days from the issue date.</li>
              <li>Customer must provide shadow-free rooftop access, water, and auxiliary AC power for erection.</li>
              <li>Net meter sanction and bi-directional meter release time depends on DISCOM feasibility.</li>
              <li>Central Government Subsidy amount will be credited directly into client bank account post-inspection.</li>
            </ol>
          </div>
          <div className="text-right flex flex-col justify-end">
            <div className="font-black text-[#166534] text-xs print:text-[10px]">For DEVAGYADI BHARAT PRIVATE LIMITED</div>
            <div className="text-slate-400 text-[10px] mt-8 print:mt-6 print:text-[9px]">Authorized Signatory & Seal</div>
          </div>
        </div>
      </div>
    </div>
  );
}
