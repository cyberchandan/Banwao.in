const generateLeadsCSV = (leads) => {
  const headers = [
    'Reference No',
    'Status',
    'Service Category',
    'City',
    'Sector',
    'Property Type',
    'Work Type',
    'Construction Type',
    'Area (SqFt)',
    'Customer Name',
    'Customer Phone',
    'Customer Email',
    'Created At'
  ];

  const rows = leads.map(l => [
    l.referenceNo || '',
    l.status || '',
    l.serviceCategoryId?.name || '',
    l.location?.city || '',
    l.location?.sector || '',
    l.propertyType || '',
    l.workType || '',
    l.constructionType || '',
    l.builtUpArea || '',
    l.customerId?.name || l.guestContact?.name || 'Guest',
    l.customerId?.phone || l.guestContact?.phone || '',
    l.customerId?.email || l.guestContact?.email || '',
    l.createdAt ? new Date(l.createdAt).toISOString().split('T')[0] : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

const generateContractorsCSV = (contractors) => {
  const headers = [
    'Business Name',
    'Owner Name',
    'Email',
    'Phone',
    'Experience Years',
    'Verification Status',
    'Rating',
    'Review Count',
    'Service Areas',
    'Registered At'
  ];

  const rows = contractors.map(c => [
    c.businessName || '',
    c.userId?.name || '',
    c.userId?.email || '',
    c.userId?.phone || '',
    c.experienceYears || 0,
    c.verificationStatus || '',
    c.ratingAvg || 0,
    c.reviewCount || 0,
    (c.serviceAreas || []).join('; '),
    c.createdAt ? new Date(c.createdAt).toISOString().split('T')[0] : ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
};

module.exports = { generateLeadsCSV, generateContractorsCSV };
