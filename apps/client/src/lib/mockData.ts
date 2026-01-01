// Mock data for the Ceylon Cargo Transport client portal

export const mockUser = {
  id: 'CLT-001',
  name: 'John Doe',
  email: 'john.doe@example.com',
  companyName: 'Acme Corporation',
  avatar: 'JD',
};

export const mockDashboardStats = {
  totalShipments: 12,
  inTransit: 3,
  delivered: 8,
  processing: 1,
};

export const mockRecentActivity = [
  {
    id: '1',
    shipmentId: 'SHIP-001-2024',
    date: 'November 28, 2024',
    location: 'Pacific Ocean',
    status: 'In Transit' as const,
  },
  {
    id: '2',
    shipmentId: 'SHIP-002-2024',
    date: 'November 20, 2024',
    location: 'New York, USA',
    status: 'Delivered' as const,
  },
  {
    id: '3',
    shipmentId: 'SHIP-003-2024',
    date: 'November 18, 2024',
    location: 'Singapore',
    status: 'Processing' as const,
  },
  {
    id: '4',
    shipmentId: 'SHIP-004-2024',
    date: 'November 23, 2024',
    location: 'Dubai, UAE',
    status: 'In Transit' as const,
  },
];

export interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'processing' | 'delayed';
  departureDate: string;
  estimatedArrival: string;
  actualArrival?: string;
  container: {
    id: string;
    type: string;
  };
  cargo: {
    type: string;
    weight: number;
    volume: number;
  };
  itemsCount?: number;
  value?: number;
}

export const mockShipments: Shipment[] = [
  {
    id: 'SHIP-001-2024',
    trackingNumber: '3354654654526',
    origin: 'Colombo, Sri Lanka',
    destination: 'London, UK',
    status: 'in_transit',
    departureDate: '2024-10-26',
    estimatedArrival: '2024-11-10',
    container: {
      id: 'CONT-458',
      type: 'Sea',
    },
    cargo: {
      type: 'Electronics',
      weight: 2500,
      volume: 45,
    },
    itemsCount: 4,
    value: 15987.00,
  },
  {
    id: 'SHIP-002-2024',
    trackingNumber: '3354654654527',
    origin: 'Shanghai, China',
    destination: 'New York, USA',
    status: 'delivered',
    departureDate: '2024-10-15',
    estimatedArrival: '2024-10-28',
    actualArrival: '2024-10-28',
    container: {
      id: 'CONT-459',
      type: 'Air',
    },
    cargo: {
      type: 'Machinery',
      weight: 4200,
      volume: 50,
    },
    itemsCount: 2,
    value: 8450.00,
  },
  {
    id: 'SHIP-003-2024',
    trackingNumber: '3354654654528',
    origin: 'Hamburg, Germany',
    destination: 'Toronto, Canada',
    status: 'processing',
    departureDate: '2024-11-01',
    estimatedArrival: '2024-11-20',
    container: {
      id: 'CONT-462',
      type: 'Sea',
    },
    cargo: {
      type: 'Consumer Goods',
      weight: 1800,
      volume: 25,
    },
    itemsCount: 6,
    value: 22300.00,
  },
  {
    id: 'SHIP-004-2024',
    trackingNumber: '3354654654529',
    origin: 'Dubai, UAE',
    destination: 'Sydney, Australia',
    status: 'in_transit',
    departureDate: '2024-10-28',
    estimatedArrival: '2024-11-12',
    container: {
      id: 'CONT-463',
      type: 'Air',
    },
    cargo: {
      type: 'Electronics',
      weight: 3200,
      volume: 38,
    },
    itemsCount: 3,
    value: 12750.00,
  },
  {
    id: 'SHIP-005-2024',
    trackingNumber: '3354654654530',
    origin: 'Singapore',
    destination: 'Los Angeles, USA',
    status: 'pending',
    departureDate: '2024-11-02',
    estimatedArrival: '2024-11-25',
    container: {
      id: 'CONT-464',
      type: 'Sea',
    },
    cargo: {
      type: 'Furniture',
      weight: 5600,
      volume: 68,
    },
    itemsCount: 8,
    value: 31200.00,
  },
];

export const mockShipmentsStats = {
  total: 12,
  inTransit: 3,
  delivered: 7,
  pending: 2,
};

export interface InvoiceLineItem {
  description: string;
  hsCode: string;
  qty: number;
  cartons: number;
  netWeight: string;
  grossWeight: string;
  dimensions: string;
  freight: number;
  customs: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  billedTo: {
    name: string;
    address: string;
    date: string;
  };
  shipmentDetails: {
    orderDate: string;
    trackingId: string;
    orderId: string;
    containerNo: string;
    originPort: string;
    destinationPort: string;
    estimatedDate: string;
  };
  recipient: {
    name: string;
    address: string;
    city: string;
    country: string;
  };
  from: {
    name: string;
    address: string;
    email: string;
  };
  lineItems: InvoiceLineItem[];
  subtotal: number;
  dutiesTax: number;
  note: string;
}

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'CCT-INV-2024-00123',
    orderId: '3354654654526',
    date: '2024-10-26',
    dueDate: '2024-11-10',
    amount: 15987.00,
    status: 'paid',
    billedTo: {
      name: 'John Doe',
      address: '847 Jewess Bridge Apt.',
      date: 'October 26, 2024',
    },
    shipmentDetails: {
      orderDate: 'October 26, 2024',
      trackingId: '3354654654526',
      orderId: '35NJ7843123',
      containerNo: 'Colombo, Sri Lanka',
      originPort: 'Origin after Port',
      destinationPort: 'London Gateway, UK',
      estimatedDate: 'Nov 10, 2024',
    },
    recipient: {
      name: 'ABC Logistics',
      address: '847 Jewess Bridge Apt.',
      city: '88 London, UK',
      country: '174 London, UK\nUK',
    },
    from: {
      name: 'Ceylon Cargo Transport',
      address: 'Cargo Road, Colombo',
      email: 'Westland@westdigital.com',
    },
    lineItems: [
      {
        description: 'Machinery Parts',
        hsCode: '3',
        qty: 2,
        cartons: 2,
        netWeight: '450 kg',
        grossWeight: '480 kg',
        dimensions: '120x80x90 cm',
        freight: 72.00,
        customs: 0,
        total: 850,
      },
      {
        description: 'Machinery Parts',
        hsCode: '2',
        qty: 1,
        cartons: 1,
        netWeight: '225 kg',
        grossWeight: '240 kg',
        dimensions: '100x70x80 cm',
        freight: 95.00,
        customs: 0,
        total: 850,
      },
      {
        description: 'Electronics Components',
        hsCode: '2',
        qty: 1,
        cartons: 1,
        netWeight: '180 kg',
        grossWeight: '200 kg',
        dimensions: '90x60x70 cm',
        freight: 120.00,
        customs: 0,
        total: 900,
      },
      {
        description: 'Textiles',
        hsCode: '2',
        qty: 0,
        cartons: 3,
        netWeight: '300 kg',
        grossWeight: '330 kg',
        dimensions: '110x75x85 cm',
        freight: 120.00,
        customs: 0,
        total: 950,
      },
    ],
    subtotal: 15750.00,
    dutiesTax: 15987.00,
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed id aliquam, sed est velus fringilla. Pellentesque plaam sem sed porta.',
  },
  {
    id: '2',
    invoiceNumber: 'CCT-INV-2024-00124',
    orderId: '3354654654527',
    date: '2024-10-15',
    dueDate: '2024-10-28',
    amount: 8450.00,
    status: 'paid',
    billedTo: {
      name: 'John Doe',
      address: '847 Jewess Bridge Apt.',
      date: 'October 15, 2024',
    },
    shipmentDetails: {
      orderDate: 'October 15, 2024',
      trackingId: '3354654654527',
      orderId: '35NJ7843124',
      containerNo: 'Shanghai, China',
      originPort: 'Shanghai Port',
      destinationPort: 'New York Port',
      estimatedDate: 'Oct 28, 2024',
    },
    recipient: {
      name: 'XYZ Logistics',
      address: '123 Main Street',
      city: 'New York, USA',
      country: 'USA',
    },
    from: {
      name: 'Ceylon Cargo Transport',
      address: 'Cargo Road, Colombo',
      email: 'Westland@westdigital.com',
    },
    lineItems: [
      {
        description: 'Machinery',
        hsCode: '4',
        qty: 2,
        cartons: 1,
        netWeight: '400 kg',
        grossWeight: '420 kg',
        dimensions: '110x75x85 cm',
        freight: 85.00,
        customs: 0,
        total: 8450,
      },
    ],
    subtotal: 8450.00,
    dutiesTax: 8450.00,
    note: 'Standard shipping terms apply.',
  },
  {
    id: '3',
    invoiceNumber: 'CCT-INV-2024-00125',
    orderId: '3354654654528',
    date: '2024-11-01',
    dueDate: '2024-11-20',
    amount: 22300.00,
    status: 'pending',
    billedTo: {
      name: 'John Doe',
      address: '847 Jewess Bridge Apt.',
      date: 'November 01, 2024',
    },
    shipmentDetails: {
      orderDate: 'November 01, 2024',
      trackingId: '3354654654528',
      orderId: '35NJ7843125',
      containerNo: 'Hamburg, Germany',
      originPort: 'Hamburg Port',
      destinationPort: 'Toronto Port',
      estimatedDate: 'Nov 20, 2024',
    },
    recipient: {
      name: 'Canada Imports Inc.',
      address: '456 King Street',
      city: 'Toronto, Canada',
      country: 'Canada',
    },
    from: {
      name: 'Ceylon Cargo Transport',
      address: 'Cargo Road, Colombo',
      email: 'Westland@westdigital.com',
    },
    lineItems: [
      {
        description: 'Consumer Goods',
        hsCode: '6',
        qty: 3,
        cartons: 6,
        netWeight: '1800 kg',
        grossWeight: '1850 kg',
        dimensions: '130x90x100 cm',
        freight: 150.00,
        customs: 0,
        total: 22300,
      },
    ],
    subtotal: 22300.00,
    dutiesTax: 22300.00,
    note: 'Fragile items, handle with care.',
  },
];
