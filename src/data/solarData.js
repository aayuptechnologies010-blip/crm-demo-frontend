// Solar CRM Data Specifications & Seed Mock Data for Devagyadi Bharat Private Limited

export const SOLAR_ROLES = [
  'Super Admin',
  'Admin',
  'Sales Executive',
  'Dealer',
  'Installer',
  'Customer'
];

export const LEAD_STATUSES = [
  'New',
  'Contacted',
  'Interested',
  'Site Survey',
  'Quotation',
  'Booking',
  'Installation',
  'Completed',
  'Lost'
];

export const SUBSIDY_STAGES = [
  { key: 'application_submitted', label: 'Application Submitted', desc: 'Registered on PM Surya Ghar portal' },
  { key: 'document_verification', label: 'Document Verification', desc: 'DISCOM checking Electricity Bill & Aadhaar' },
  { key: 'discom_feasibility', label: 'DISCOM Feasibility Approval', desc: 'Grid capacity & sanction clearance' },
  { key: 'installation_completed', label: 'Installation & WCR', desc: 'Work completion report submitted' },
  { key: 'meter_installed', label: 'Net Meter Commissioned', desc: 'Bi-directional meter synchronized' },
  { key: 'inspection_passed', label: 'Joint Inspection Done', desc: 'DISCOM inspection approved' },
  { key: 'subsidy_approved', label: 'Subsidy Approved', desc: 'Claim generated on National Portal' },
  { key: 'subsidy_disbursed', label: 'Subsidy Disbursed', desc: 'Amount credited into Customer Bank A/c' }
];

export const SAMPLE_SOLAR_LEADS = [
  {
    id: 'SL-101',
    customerName: 'Rajendra Prasad Sharma',
    mobile: '9876543210',
    location: 'Gomti Nagar, Lucknow',
    district: 'Lucknow',
    electricityBillAvg: '₹4,800/mo',
    consumerNumber: 'PU-78392104',
    requiredKw: '5 kW',
    leadSource: 'Dealer Network',
    dealerName: 'Awadh Solar Point',
    salesExecutive: 'Amit Verma',
    followUpDate: '2026-10-12',
    status: 'Site Survey',
    roofType: 'RCC Flat',
    roofArea: '650 sq.ft',
    estimatedAmount: 285000,
    subsidyAmount: 78000,
    payableAmount: 207000,
    notes: 'Customer interested in Mono PERC bifacial modules. Shadow free roof available.'
  },
  {
    id: 'SL-102',
    customerName: 'Vikram Singh Chauhan',
    mobile: '9811223344',
    location: 'Civil Lines, Kanpur',
    district: 'Kanpur Nagar',
    electricityBillAvg: '₹3,200/mo',
    consumerNumber: 'KU-44589211',
    requiredKw: '3 kW',
    leadSource: 'PM Surya Ghar Campaign',
    dealerName: 'Direct',
    salesExecutive: 'Sneha Patel',
    followUpDate: '2026-10-10',
    status: 'Quotation',
    roofType: 'Tin Shed',
    roofArea: '400 sq.ft',
    estimatedAmount: 180000,
    subsidyAmount: 78000,
    payableAmount: 102000,
    notes: 'Quotation shared on WhatsApp. Customer waiting for family discussion on loan option.'
  },
  {
    id: 'SL-103',
    customerName: 'Sunita Devi Agrawal',
    mobile: '9788112245',
    location: 'Ashiyana, Lucknow',
    district: 'Lucknow',
    electricityBillAvg: '₹6,500/mo',
    consumerNumber: 'PU-99382012',
    requiredKw: '7 kW',
    leadSource: 'Website Inquiry',
    dealerName: 'Direct',
    salesExecutive: 'Amit Verma',
    followUpDate: '2026-10-15',
    status: 'Booking',
    roofType: 'RCC Flat Elevated',
    roofArea: '900 sq.ft',
    estimatedAmount: 395000,
    subsidyAmount: 78000,
    payableAmount: 317000,
    notes: 'Token advance received ₹25,000. Material dispatch scheduled.'
  },
  {
    id: 'SL-104',
    customerName: 'Dinesh Kumar Maurya',
    mobile: '9450123456',
    location: 'Sigra, Varanasi',
    district: 'Varanasi',
    electricityBillAvg: '₹2,500/mo',
    consumerNumber: 'VU-10293847',
    requiredKw: '2 kW',
    leadSource: 'Canvassing',
    dealerName: 'Kashi Green Energy',
    salesExecutive: 'Rohan Gupta',
    followUpDate: '2026-10-09',
    status: 'Installation',
    roofType: 'RCC Flat',
    roofArea: '300 sq.ft',
    estimatedAmount: 130000,
    subsidyAmount: 60000,
    payableAmount: 70000,
    notes: 'Panels & Inverter reached customer site. Installer assigned.'
  },
  {
    id: 'SL-105',
    customerName: 'Dr. Anand Swaroop Mishra',
    mobile: '9935678901',
    location: 'Aliganj, Lucknow',
    district: 'Lucknow',
    electricityBillAvg: '₹9,200/mo',
    consumerNumber: 'PU-12093485',
    requiredKw: '10 kW',
    leadSource: 'Referral',
    dealerName: 'Awadh Solar Point',
    salesExecutive: 'Amit Verma',
    followUpDate: '2026-10-18',
    status: 'Completed',
    roofType: 'RCC Flat',
    roofArea: '1200 sq.ft',
    estimatedAmount: 540000,
    subsidyAmount: 78000,
    payableAmount: 462000,
    notes: 'Net meter synchronization complete. PM Surya Ghar subsidy disbursed.'
  }
];

export const SAMPLE_SOLAR_PROJECTS = [
  {
    projectId: 'DBPL-2026-00001',
    customerName: 'Dr. Anand Swaroop Mishra',
    mobile: '9935678901',
    address: 'B-42, Sector C, Aliganj',
    district: 'Lucknow',
    consumerNumber: 'PU-12093485',
    solarCapacity: '10 kW',
    panelBrand: 'Waaree 550W TopCon (18 Panels)',
    inverterBrand: 'Growatt 10kW On-Grid 3-Phase',
    structureType: 'Elevated GI Heavy Duty (6ft height)',
    assignedExecutive: 'Amit Verma',
    assignedInstaller: 'Rameshwar Sharma (Chief Technician)',
    totalAmount: 540000,
    paidAmount: 540000,
    dueAmount: 0,
    subsidyStatus: 'Subsidy Received',
    subsidyAmount: 78000,
    commissioningDate: '2026-09-28',
    netMeterStatus: 'Installed & Synchronized'
  },
  {
    projectId: 'DBPL-2026-00002',
    customerName: 'Sunita Devi Agrawal',
    mobile: '9788112245',
    address: 'Plot 104, Sector K, Ashiyana',
    district: 'Lucknow',
    consumerNumber: 'PU-99382012',
    solarCapacity: '7 kW',
    panelBrand: 'Adani Solar 540W Mono PERC',
    inverterBrand: 'Luminous 7kW Grid Tie',
    structureType: 'Standard HDG Structure',
    assignedExecutive: 'Amit Verma',
    assignedInstaller: 'Vikram Yadav',
    totalAmount: 395000,
    paidAmount: 150000,
    dueAmount: 245000,
    subsidyStatus: 'Inspection Done',
    subsidyAmount: 78000,
    commissioningDate: 'Pending',
    netMeterStatus: 'DISCOM Application Approved'
  },
  {
    projectId: 'DBPL-2026-00003',
    customerName: 'Dinesh Kumar Maurya',
    mobile: '9450123456',
    address: 'Near Bharat Mata Mandir, Sigra',
    district: 'Varanasi',
    consumerNumber: 'VU-10293847',
    solarCapacity: '2 kW',
    panelBrand: 'Tata Power Solar 545W Mono PERC',
    inverterBrand: 'Microtek 2.2kW On-Grid',
    structureType: 'Flush Mount Tin Shed GI',
    assignedExecutive: 'Rohan Gupta',
    assignedInstaller: 'Mahesh Chauhan',
    totalAmount: 130000,
    paidAmount: 90000,
    dueAmount: 40000,
    subsidyStatus: 'Installation Underway',
    subsidyAmount: 60000,
    commissioningDate: 'Expected Oct 2026',
    netMeterStatus: 'Meter Requisition Submitted'
  }
];

export const SAMPLE_SITE_SURVEYS = [
  {
    id: 'SRV-001',
    leadId: 'SL-101',
    customerName: 'Rajendra Prasad Sharma',
    mobile: '9876543210',
    surveyDate: '2026-10-06',
    surveyorName: 'Rameshwar Sharma',
    roofType: 'RCC Flat',
    roofArea: '650 sq.ft',
    shadowDetails: 'Zero shadow between 8:30 AM to 5:00 PM. High sun exposure.',
    loadDetails: 'Sanctioned 6 kW, 3-Phase Connection',
    proposedCapacity: '5 kW (9 Modules of 550W)',
    panelRequirement: '9 x 550W Mono PERC Bifacial',
    inverterRequirement: '5kW 3-Phase Grid Tie (Growatt/Polycab)',
    structureDetails: 'South-facing 15° tilt GI Hot-dip galvanised',
    earthing: 'Chemical Earthing 3 pits (AC, DC, LA Lightning Arrester)',
    photosCount: 5,
    status: 'Survey Approved',
    remarks: 'Customer wants elevated structure by 2ft so rooftop space can be used for laundry.'
  },
  {
    id: 'SRV-002',
    leadId: 'SL-102',
    customerName: 'Vikram Singh Chauhan',
    mobile: '9811223344',
    surveyDate: '2026-10-07',
    surveyorName: 'Mahesh Chauhan',
    roofType: 'Industrial Tin Shed',
    roofArea: '400 sq.ft',
    shadowDetails: 'Small water tank towards North-West, doesn’t cause obstruction.',
    loadDetails: 'Sanctioned 4 kW, Single Phase',
    proposedCapacity: '3 kW (6 Modules of 540W)',
    panelRequirement: '6 x 540W Mono PERC',
    inverterRequirement: '3.3kW Single Phase On-Grid',
    structureDetails: 'Short rail aluminum clamps for tin roof',
    earthing: '2 Chemical Earth Pits + Surge Protection Device (SPD)',
    photosCount: 4,
    status: 'Completed',
    remarks: 'Cable distance to main LT DB is approx 18 meters.'
  }
];

export const SAMPLE_SOLAR_ORDERS = [
  {
    orderId: 'ORD-2026-0041',
    customerName: 'Rajendra Prasad Sharma',
    mobile: '9876543210',
    orderDate: '2026-10-08',
    systemCapacity: '5 kW',
    totalAmount: 318640,
    bookingAmount: 50000,
    materialStatus: 'Dispatched from Warehouse', // Ordered, In Transit, Dispatched, Delivered at Site
    paymentStatus: 'Token Received (20%)',       // Pending, Token Received, 70% Cleared, Fully Paid
    installationStatus: 'Site Survey Done - Team Assigned', // Pending Survey, Scheduled, In Progress, Commissioned
    consumerNumber: 'PU-78392104',
    district: 'Lucknow',
    panelBrand: 'Waaree 550W TopCon (9 Nos.)',
    inverterBrand: 'Growatt 5kW 3-Phase',
    assignedInstaller: 'Rameshwar Sharma',
    deliveryDate: '2026-10-14'
  },
  {
    orderId: 'ORD-2026-0042',
    customerName: 'Sunita Devi Agrawal',
    mobile: '9788112245',
    orderDate: '2026-10-05',
    systemCapacity: '7 kW',
    totalAmount: 395000,
    bookingAmount: 75000,
    materialStatus: 'Delivered at Site',
    paymentStatus: '70% Cleared (Material Stage)',
    installationStatus: 'In Progress (Structure Erected)',
    consumerNumber: 'PU-99382012',
    district: 'Lucknow',
    panelBrand: 'Adani Solar 540W Mono PERC',
    inverterBrand: 'Luminous 7kW Grid Tie',
    assignedInstaller: 'Vikram Yadav',
    deliveryDate: '2026-10-09'
  },
  {
    orderId: 'ORD-2026-0043',
    customerName: 'Dr. Anand Swaroop Mishra',
    mobile: '9935678901',
    orderDate: '2026-09-20',
    systemCapacity: '10 kW',
    totalAmount: 540000,
    bookingAmount: 100000,
    materialStatus: 'Delivered & Installed',
    paymentStatus: 'Fully Paid (100%)',
    installationStatus: 'Commissioned & Net Meter Synced',
    consumerNumber: 'PU-12093485',
    district: 'Lucknow',
    panelBrand: 'Waaree 550W TopCon (18 Nos.)',
    inverterBrand: 'Growatt 10kW 3-Phase',
    assignedInstaller: 'Rameshwar Sharma',
    deliveryDate: '2026-09-25'
  },
  {
    orderId: 'ORD-2026-0044',
    customerName: 'Dinesh Kumar Maurya',
    mobile: '9450123456',
    orderDate: '2026-10-02',
    systemCapacity: '2 kW',
    totalAmount: 130000,
    bookingAmount: 25000,
    materialStatus: 'In Transit',
    paymentStatus: 'Token Received (20%)',
    installationStatus: 'Scheduled for 16th Oct',
    consumerNumber: 'VU-10293847',
    district: 'Varanasi',
    panelBrand: 'Tata Power Solar 545W Mono PERC',
    inverterBrand: 'Microtek 2.2kW On-Grid',
    assignedInstaller: 'Mahesh Chauhan',
    deliveryDate: '2026-10-15'
  },
  {
    orderId: 'ORD-2026-0045',
    customerName: 'Vikram Singh Chauhan',
    mobile: '9811223344',
    orderDate: '2026-10-11',
    systemCapacity: '3 kW',
    totalAmount: 180000,
    bookingAmount: 36000,
    materialStatus: 'Order Placed with Vendor',
    paymentStatus: 'Token Received (20%)',
    installationStatus: 'Pending Material Delivery',
    consumerNumber: 'KU-44589211',
    district: 'Kanpur Nagar',
    panelBrand: 'Waaree 540W Mono PERC',
    inverterBrand: 'Growatt 3.3kW Single Phase',
    assignedInstaller: 'Mahesh Chauhan',
    deliveryDate: '2026-10-18'
  }
];

export const SAMPLE_DEALERS = [
  {
    id: 'DLR-01',
    name: 'Awadh Solar Point',
    contactPerson: 'Sandeep Tiwari',
    mobile: '9415099881',
    email: 'sandeep.awadh@gmail.com',
    district: 'Lucknow',
    address: 'Shop 14, Vibhuti Khand, Gomti Nagar, Lucknow',
    gstin: '09AAACA1234F1Z8',
    panNumber: 'AAACA1234F',
    commissionRateKw: 1500, // ₹1,500 per kW sold
    totalLeads: 28,
    convertedLeads: 18,
    closedSalesKw: '112 kW',
    totalSalesValue: 6048000,
    commissionEarned: 168000,
    commissionPaid: 120000,
    commissionPending: 48000,
    rating: '4.9 ★',
    status: 'Active',
    joinedDate: '2025-11-15',
    lastLogin: '2026-10-11 18:40',
    bankDetails: {
      accountHolder: 'Awadh Solar Point',
      accountNumber: '50200084729104',
      ifsc: 'HDFC0001234',
      bankName: 'HDFC Bank, Gomti Nagar'
    },
    paymentsHistory: [
      { id: 'PAY-DLR-001', date: '2026-08-30', amount: 70000, mode: 'NEFT / Bank Transfer', txnId: 'HDFC839201948', status: 'Paid', remarks: 'August milestone commission' },
      { id: 'PAY-DLR-002', date: '2026-09-28', amount: 50000, mode: 'UPI / IMPS', txnId: 'UPI9837194821', status: 'Paid', remarks: 'September installation clearances' }
    ]
  },
  {
    id: 'DLR-02',
    name: 'Kashi Green Energy Systems',
    contactPerson: 'Prabhat Pandey',
    mobile: '9839088772',
    email: 'kashi.green@rediffmail.com',
    district: 'Varanasi',
    address: 'D-58/12, Sigra Crossing, Varanasi',
    gstin: '09BBBCB5678G2Z1',
    panNumber: 'BBBCB5678G',
    commissionRateKw: 1500,
    totalLeads: 19,
    convertedLeads: 12,
    closedSalesKw: '68 kW',
    totalSalesValue: 3672000,
    commissionEarned: 102000,
    commissionPaid: 85000,
    commissionPending: 17000,
    rating: '4.7 ★',
    status: 'Active',
    joinedDate: '2026-01-10',
    lastLogin: '2026-10-10 11:20',
    bankDetails: {
      accountHolder: 'Kashi Green Energy Systems',
      accountNumber: '382901928374',
      ifsc: 'SBIN0000543',
      bankName: 'State Bank of India, Sigra'
    },
    paymentsHistory: [
      { id: 'PAY-DLR-003', date: '2026-09-15', amount: 85000, mode: 'RTGS', txnId: 'SBIN192837482', status: 'Paid', remarks: 'Q2 Dealer Sales Commission' }
    ]
  },
  {
    id: 'DLR-03',
    name: 'Braj Renewable Solutions',
    contactPerson: 'Manoj Saraswat',
    mobile: '9927011223',
    email: 'manoj.brajsolar@outlook.com',
    district: 'Mathura & Agra',
    address: 'Opposite Mandi Samiti, Delhi Road, Mathura',
    gstin: '09CCCC7890H3Z9',
    panNumber: 'CCCC7890H',
    commissionRateKw: 1500,
    totalLeads: 14,
    convertedLeads: 8,
    closedSalesKw: '45 kW',
    totalSalesValue: 2430000,
    commissionEarned: 67500,
    commissionPaid: 50000,
    commissionPending: 17500,
    rating: '4.8 ★',
    status: 'Active',
    joinedDate: '2026-03-01',
    lastLogin: '2026-10-09 16:15',
    bankDetails: {
      accountHolder: 'Braj Renewable Solutions',
      accountNumber: '918273645019',
      ifsc: 'PUNB0182900',
      bankName: 'Punjab National Bank, Mathura'
    },
    paymentsHistory: [
      { id: 'PAY-DLR-004', date: '2026-08-20', amount: 50000, mode: 'NEFT', txnId: 'PUNB938201948', status: 'Paid', remarks: 'First tranche release' }
    ]
  }
];

export const SAMPLE_COMPLAINTS = [
  {
    complaintNumber: 'CMP-2026-08',
    id: 'CMP-2026-08',
    customerName: 'Alok Nath Srivastava',
    projectId: 'DBPL-2025-00142',
    consumerNo: 'PU-12098451',
    mobile: '9415234567',
    complaintType: 'Inverter Grid Error / Generation Drop',
    priority: 'High',
    technicianName: 'Vikram Yadav',
    technicianAssignment: 'Vikram Yadav (Lead Solar Tech)',
    visitDate: '2026-10-09',
    complaintStatus: 'In Progress',
    status: 'In Progress',
    reportedDate: '2026-10-07',
    description: 'Inverter displaying Fault 04 (Grid Overvoltage). Generation halted during afternoon peak sunlight hours.',
    resolution: 'Technician visited site. Checked grid voltage parameters on LT panel (found fluctuating to 258V). Recalibrated grid upper threshold & tightened loose AC wiring.',
    beforePhotos: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=500&auto=format&fit=crop&q=60',
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60'
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1497440001374-f26997328c1b?w=500&auto=format&fit=crop&q=60'
    ]
  },
  {
    complaintNumber: 'CMP-2026-09',
    id: 'CMP-2026-09',
    customerName: 'Shree Krishna Cold Storage',
    projectId: 'DBPL-2025-00098',
    consumerNo: 'PU-99382012',
    mobile: '9838776655',
    complaintType: 'Routine Maintenance / Panel Cleaning Service',
    priority: 'Low',
    technicianName: 'Rameshwar Sharma',
    technicianAssignment: 'Rameshwar Sharma (O&M Specialist)',
    visitDate: '2026-10-11',
    complaintStatus: 'Scheduled',
    status: 'Scheduled',
    reportedDate: '2026-10-08',
    description: 'Quarterly AMC panel washing and string DC voltage check requested before festive peak.',
    resolution: 'Awaiting scheduled visit on 11th Oct. Assigned team with water pressure jet & multimeter kit.',
    beforePhotos: [
      'https://images.unsplash.com/photo-1545208942-e1c9c916524b?w=500&auto=format&fit=crop&q=60'
    ],
    afterPhotos: []
  },
  {
    complaintNumber: 'CMP-2026-10',
    id: 'CMP-2026-10',
    customerName: 'Dr. Anand Swaroop Mishra',
    projectId: 'DBPL-2026-00001',
    consumerNo: 'PU-12093485',
    mobile: '9935678901',
    complaintType: 'Net Meter Reading Mismatch',
    priority: 'Medium',
    technicianName: 'Mahesh Chauhan',
    technicianAssignment: 'Mahesh Chauhan (Electrical Engineer)',
    visitDate: '2026-10-06',
    complaintStatus: 'Resolved',
    status: 'Resolved',
    reportedDate: '2026-10-04',
    description: 'Discom net meter export reading was not syncing with mobile monitoring app.',
    resolution: 'Wi-Fi datalogger dongle re-configured and reconnected to home router. Generation and export logs synchronized successfully with DISCOM portal.',
    beforePhotos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60'
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=500&auto=format&fit=crop&q=60'
    ]
  },
  {
    complaintNumber: 'CMP-2026-11',
    id: 'CMP-2026-11',
    customerName: 'Sunita Devi Agrawal',
    projectId: 'DBPL-2026-00002',
    consumerNo: 'PU-88291034',
    mobile: '9788112245',
    complaintType: 'Earthing Pit Resistance Issue',
    priority: 'Urgent',
    technicianName: 'Amit Tiwari',
    technicianAssignment: 'Amit Tiwari (Earthing & Safety Tech)',
    visitDate: '2026-10-14',
    complaintStatus: 'Assigned',
    status: 'Assigned',
    reportedDate: '2026-10-11',
    description: 'Inverter displaying PE Earth Fault alert following rain showers. Resistance test needed.',
    resolution: 'Site visit scheduled with Bentonite chemical earth compound and megger test meter.',
    beforePhotos: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&auto=format&fit=crop&q=60'
    ],
    afterPhotos: []
  },
  {
    complaintNumber: 'CMP-2026-12',
    id: 'CMP-2026-12',
    customerName: 'Rajendra Prasad Sharma',
    projectId: 'DBPL-2026-00006',
    consumerNo: 'PU-78392104',
    mobile: '9876543210',
    complaintType: 'Solar Panel Physical Damage / Hotspot',
    priority: 'High',
    technicianName: 'Vikram Yadav',
    technicianAssignment: 'Vikram Yadav (Lead Solar Tech)',
    visitDate: '2026-10-10',
    complaintStatus: 'Resolved',
    status: 'Resolved',
    reportedDate: '2026-10-09',
    description: 'One panel glass had a small hairline crack caused by monkey movement on the terrace.',
    resolution: 'Warranty claim processed with Waaree factory. Defective 550W module replaced with brand new panel and clamp recrimped.',
    beforePhotos: [
      'https://images.unsplash.com/photo-1508873696983-2df57046475b?w=500&auto=format&fit=crop&q=60'
    ],
    afterPhotos: [
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=500&auto=format&fit=crop&q=60'
    ]
  }
];

