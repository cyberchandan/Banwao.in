require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const ServiceCategory = require('../models/ServiceCategory');
const ServiceArea = require('../models/ServiceArea');
const ContractorProfile = require('../models/ContractorProfile');
const Project = require('../models/Project');
const Lead = require('../models/Lead');
const { ROLES, CONTRACTOR_STATUS, LEAD_STATUS } = require('../config/constants');

const categoriesData = [
  {
    name: 'New House Construction',
    slug: 'new-construction',
    icon: 'Building2',
    shortDesc: 'Complete end-to-end residential home construction from architectural planning to structural handover.',
    fullDesc: 'Build your dream independent home in Noida or Greater Noida. Comprehensive services including architectural structural design, soil testing, foundation work, RCC brickwork, plastering, plumbing, electrical, tile flooring, and interior finishing.',
    isPopular: true,
    displayOrder: 1,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Turnkey Material + Labour Construction',
    slug: 'turnkey-construction',
    icon: 'Layers',
    shortDesc: 'Worry-free full contract package including high-quality materials, skilled manpower, and project management.',
    fullDesc: 'Hand over all construction stress to verified contractors. Turnkey contract covers branded cement, steel, bricks, sand, electrical wires, plumbing fixtures, tiles, paints, and complete workforce supervision.',
    isPopular: true,
    displayOrder: 2,
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Labour-Only Construction',
    slug: 'labour-only-construction',
    icon: 'Users',
    shortDesc: 'Hire experienced mason, carpenter, and helper workforces while you source your own materials.',
    fullDesc: 'Ideal for homeowners who want complete personal control over material purchasing. Contractors supply skilled mistri (masons), helpers, shuttering equipment, and site supervisors charged per sq ft or per day.',
    isPopular: false,
    displayOrder: 3,
    imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Independent-Floor Construction',
    slug: 'independent-floor-construction',
    icon: 'Home',
    shortDesc: 'Construct additional builder floors or stilt + 4 floor layouts as per Noida Authority norms.',
    fullDesc: 'Specially structured for plot owners in Noida and Greater Noida sectors. Construct modern builder floors with dedicated lift wells, car parking stilts, separate utility meters, and individual floor privacy.',
    isPopular: true,
    displayOrder: 4,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Home Renovation & Remodeling',
    slug: 'home-renovation',
    icon: 'Hammer',
    shortDesc: 'Full house, kitchen, and bathroom remodeling to modernize older properties and interiors.',
    fullDesc: 'Transform existing villas, flats, or builder floors. Services include wall demolition, floor retiling, modular kitchen installation, false ceiling LED lights, and luxury bathroom upgrades.',
    isPopular: true,
    displayOrder: 5,
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Interior & Exterior Painting',
    slug: 'painting-services',
    icon: 'Paintbrush',
    shortDesc: 'Professional wall painting, texture finishes, waterproof coating, and wood polishing.',
    fullDesc: 'Premium Asian Paints / Berger / Nerolac painting solutions. Includes wall putty, primer, damp-proof treatment, royal velvet texture walls, PU wood polishing, and weather-shield exterior paint.',
    isPopular: true,
    displayOrder: 6,
    imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Plumbing Works & Sanitary Fittings',
    slug: 'plumbing-services',
    icon: 'Pipette',
    shortDesc: 'CPVC/UPVC pipe fittings, water tank installations, bathroom sanitaryware, and leak fixes.',
    fullDesc: 'Complete plumbing solutions for new builds and renovation. Concealed piping, pressure testing, Kohler/Jaguar fixture installations, drain line laying, and solar water heater connections.',
    isPopular: false,
    displayOrder: 7,
    imageUrl: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Electrical Wiring & Lighting',
    slug: 'electrical-services',
    icon: 'Zap',
    shortDesc: 'Concealed conduit electrical wiring, distribution boards, MCB boxes, and smart switchboards.',
    fullDesc: 'Certified electrical contractors for high-safety wiring (Havells/Finolex), 3-phase connection setup, EV charger points, inverter wiring, smart home automation switches, and accent lighting.',
    isPopular: false,
    displayOrder: 8,
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Waterproofing & Roof Protection',
    slug: 'waterproofing',
    icon: 'ShieldCheck',
    shortDesc: 'Terrace elastomeric coating, basement pressure grouting, and dampness treatment.',
    fullDesc: 'Guaranteed leak protection for roofs, balconies, and basements in NCR weather. Chemical injection grouting, Dr. Fixit chemical membranes, brickbat coba, and thermal insulation tiles.',
    isPopular: true,
    displayOrder: 9,
    imageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Masonry & Concrete Works',
    slug: 'masonry-works',
    icon: 'Ruler',
    shortDesc: 'Fly ash brickwork, AAC block walls, boundary wall construction, and plastering.',
    fullDesc: 'Heavy brick masonry, boundary walls, RCC lintel beams, external sand-face plastering, and cement flooring for open plots and extensions.',
    isPopular: false,
    displayOrder: 10,
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'Carpentry & Modular Woodwork',
    slug: 'carpentry-woodwork',
    icon: 'Wrench',
    shortDesc: 'Custom wardrobes, flush doors, wooden paneling, TV units, and modular kitchens.',
    fullDesc: 'Commercial ply & teak wood carpentry work. Factory finish edge-banding, soft-close hardware, veneer polishing, and custom storage solutions.',
    isPopular: false,
    displayOrder: 11,
    imageUrl: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?q=80&w=800&auto=format&fit=crop'
  },
  {
    name: 'General Home Maintenance & Repairs',
    slug: 'repairs-maintenance',
    icon: 'Tool',
    shortDesc: 'Quick handyman repairs, tile replacement, door lock changes, and civil maintenance.',
    fullDesc: 'Reliable repair contractors for small scale civil work, door fitting, tile re-grouting, ceiling repairs, and property maintenance in Noida & Greater Noida.',
    isPopular: false,
    displayOrder: 12,
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop'
  }
];

const serviceAreasData = [
  // Noida
  { city: 'Noida', sector: 'Sector 62', pincode: '201309' },
  { city: 'Noida', sector: 'Sector 18', pincode: '201301' },
  { city: 'Noida', sector: 'Sector 50', pincode: '201307' },
  { city: 'Noida', sector: 'Sector 75', pincode: '201301' },
  { city: 'Noida', sector: 'Sector 78', pincode: '201301' },
  { city: 'Noida', sector: 'Sector 128', pincode: '201304' },
  { city: 'Noida', sector: 'Sector 137', pincode: '201305' },
  { city: 'Noida', sector: 'Sector 150', pincode: '201310' },
  { city: 'Noida', sector: 'Noida All Sectors', pincode: '201301' },

  // Greater Noida
  { city: 'Greater Noida', sector: 'Greater Noida West (Noida Extension)', pincode: '201306' },
  { city: 'Greater Noida', sector: 'Pari Chowk / Knowledge Park', pincode: '201310' },
  { city: 'Greater Noida', sector: 'Omega 1 & 2', pincode: '201308' },
  { city: 'Greater Noida', sector: 'Delta 1, 2 & 3', pincode: '201308' },
  { city: 'Greater Noida', sector: 'Zeta 1 & 2', pincode: '201306' },
  { city: 'Greater Noida', sector: 'Alpha 1 & 2', pincode: '201308' },
  { city: 'Greater Noida', sector: 'Greater Noida All Sectors', pincode: '201308' }
];

const seedDB = async () => {
  await connectDB();

  console.log('🧹 Clearing existing seed collections...');
  await ServiceCategory.deleteMany({});
  await ServiceArea.deleteMany({});
  // We keep users unless explicitly resetting
  
  console.log('🌱 Seeding Service Categories...');
  const createdCategories = await ServiceCategory.insertMany(categoriesData);
  console.log(`✅ Created ${createdCategories.length} service categories.`);

  console.log('🌱 Seeding Service Areas...');
  const createdAreas = await ServiceArea.insertMany(serviceAreasData);
  console.log(`✅ Created ${createdAreas.length} service areas.`);

  // Create Admin User if not existing
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@banwao.in';
  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const adminPassHash = await User.hashPassword(process.env.ADMIN_PASSWORD || 'AdminPass123!');
    adminUser = await User.create({
      name: process.env.ADMIN_NAME || 'Banwao Super Admin',
      email: adminEmail,
      phone: '+919876543210',
      passwordHash: adminPassHash,
      role: ROLES.ADMIN
    });
    console.log('✅ Created default Admin account: admin@banwao.in / AdminPass123!');
  }

  // Create Sample Demo Customer
  const customerEmail = 'customer@banwao.in';
  let customerUser = await User.findOne({ email: customerEmail });
  if (!customerUser) {
    const customerPassHash = await User.hashPassword('CustomerPass123!');
    customerUser = await User.create({
      name: 'Rajesh Sharma',
      email: customerEmail,
      phone: '+919811223344',
      passwordHash: customerPassHash,
      role: ROLES.CUSTOMER
    });
    console.log('✅ Created Demo Customer account: customer@banwao.in / CustomerPass123!');
  }

  // Create Demo Contractors (Approved & Verified)
  const newConstCat = createdCategories.find(c => c.slug === 'new-construction');
  const turnkeyCat = createdCategories.find(c => c.slug === 'turnkey-construction');
  const renovationCat = createdCategories.find(c => c.slug === 'home-renovation');
  const paintingCat = createdCategories.find(c => c.slug === 'painting-services');

  const demoContractorsData = [
    {
      name: 'Vikram Singh (Apex Buildtech)',
      email: 'apexbuildtech@banwao.in',
      phone: '+919899112233',
      businessName: 'Apex Buildtech & Infra (Demo Verified Partner)',
      experienceYears: 12,
      skills: ['Turnkey Construction', 'Independent Floors', 'Structural Steel', 'Architecture Design'],
      categories: [newConstCat._id, turnkeyCat._id],
      serviceAreas: ['Noida Sector 62', 'Noida Sector 50', 'Noida Sector 150', 'Greater Noida West'],
      description: 'Award-winning residential builder in NCR with over 45+ completed villas and builder floors. Full turnkey material and labour contracts with 10-year structural guarantee.',
      verificationStatus: CONTRACTOR_STATUS.APPROVED,
      isVerifiedBadge: true,
      ratingAvg: 4.8,
      reviewCount: 19,
      completedProjectsCount: 38
    },
    {
      name: 'Suresh Kumar (Kumar Painters)',
      email: 'kumarpainters@banwao.in',
      phone: '+919877665544',
      businessName: 'Kumar Painting & Waterproofing Solutions (Demo Verified)',
      experienceYears: 8,
      skills: ['Interior Painting', 'Wall Texture', 'Dr. Fixit Waterproofing', 'PU Wood Polish'],
      categories: [paintingCat._id, renovationCat._id],
      serviceAreas: ['Noida All Sectors', 'Greater Noida Extension'],
      description: 'Specialist in Asian Paints Royal Velvet texture wall finishes, weather-proof exterior coatings, and zero-dampness roof waterproofing.',
      verificationStatus: CONTRACTOR_STATUS.APPROVED,
      isVerifiedBadge: true,
      ratingAvg: 4.6,
      reviewCount: 14,
      completedProjectsCount: 26
    },
    {
      name: 'Amit Verma (Noida Home Crafts)',
      email: 'noidahomecrafts@banwao.in',
      phone: '+919855443322',
      businessName: 'Noida Home Craft Renovations (Demo Partner)',
      experienceYears: 6,
      skills: ['Modular Kitchen', 'Bathroom Remodeling', 'Tile Flooring', 'False Ceiling'],
      categories: [renovationCat._id],
      serviceAreas: ['Noida Sector 75', 'Noida Sector 78', 'Noida Sector 137', 'Greater Noida West'],
      description: 'Modern residential home renovation contractor. High quality modular fittings, Italian marble tiling, and rapid execution within agreed timelines.',
      verificationStatus: CONTRACTOR_STATUS.APPROVED,
      isVerifiedBadge: true,
      ratingAvg: 4.7,
      reviewCount: 9,
      completedProjectsCount: 15
    }
  ];

  for (const cData of demoContractorsData) {
    let user = await User.findOne({ email: cData.email });
    if (!user) {
      const hash = await User.hashPassword('ContractorPass123!');
      user = await User.create({
        name: cData.name,
        email: cData.email,
        phone: cData.phone,
        passwordHash: hash,
        role: ROLES.CONTRACTOR
      });

      await ContractorProfile.create({
        userId: user._id,
        businessName: cData.businessName,
        experienceYears: cData.experienceYears,
        skills: cData.skills,
        categories: cData.categories,
        serviceAreas: cData.serviceAreas,
        description: cData.description,
        verificationStatus: cData.verificationStatus,
        isVerifiedBadge: cData.isVerifiedBadge,
        ratingAvg: cData.ratingAvg,
        reviewCount: cData.reviewCount,
        completedProjectsCount: cData.completedProjectsCount,
        portfolioImages: [
          {
            title: 'Modern Independent Floor - Sector 50 Noida',
            url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
            description: '3000 sq ft luxury stilt + 3 builder floor constructed on turnkey material contract.'
          },
          {
            title: 'Full Villa Interior Renovation - Greater Noida West',
            url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop',
            description: 'Complete interior remodeling with false ceiling, tile flooring, and fresh paint.'
          }
        ]
      });
      console.log(`✅ Created Demo Contractor: ${cData.businessName} (${cData.email} / ContractorPass123!)`);
    }
  }

  // Seed Architectural Projects
  const firstContractor = await ContractorProfile.findOne({ verificationStatus: CONTRACTOR_STATUS.APPROVED });
  const sampleProjects = [
    {
      title: 'Modern Independent Floor Construction - Sector 50, Noida',
      description: '4-story luxury independent builder floor with stilt parking, Italian marble flooring, and solar water heating.',
      categoryId: newConstCat._id,
      location: { city: 'Noida', sector: 'Sector 50' },
      images: [
        { url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop', caption: 'Front Elevation' },
        { url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?q=80&w=1200&auto=format&fit=crop', caption: 'Living Room Design' }
      ],
      contractorId: firstContractor ? firstContractor._id : null,
      builtUpArea: 3600,
      estimatedCostRange: '₹65 Lakhs - ₹80 Lakhs',
      completionDate: '2025-11-20',
      isFeatured: true
    },
    {
      title: 'Turnkey Luxury Villa Renovation - Sector 150, Noida',
      description: 'Complete structural and interior renovation including open modular kitchen, toughened glass balcony railings, and exterior waterproofing.',
      categoryId: renovationCat._id,
      location: { city: 'Noida', sector: 'Sector 150' },
      images: [
        { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop', caption: 'Exterior View' },
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop', caption: 'Master Bedroom' }
      ],
      contractorId: firstContractor ? firstContractor._id : null,
      builtUpArea: 2800,
      estimatedCostRange: '₹25 Lakhs - ₹35 Lakhs',
      completionDate: '2026-01-15',
      isFeatured: true
    },
    {
      title: 'High-End Texture Painting & Waterproofing - Greater Noida West',
      description: 'Royal velvet interior wall painting with zero-leakage elastomeric terrace waterproofing for a 4BHK penthouse.',
      categoryId: paintingCat._id,
      location: { city: 'Greater Noida', sector: 'Greater Noida West (Noida Extension)' },
      images: [
        { url: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?q=80&w=1200&auto=format&fit=crop', caption: 'Wall Texture Accent' }
      ],
      contractorId: firstContractor ? firstContractor._id : null,
      builtUpArea: 2200,
      estimatedCostRange: '₹3.5 Lakhs - ₹5 Lakhs',
      completionDate: '2026-02-10',
      isFeatured: true
    }
  ];

  await Project.deleteMany({});
  await Project.insertMany(sampleProjects);
  console.log('✅ Created sample portfolio projects.');

  console.log('=================================================');
  console.log('🎉 BANWAO DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('=================================================');
  process.exit(0);
};

seedDB().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
