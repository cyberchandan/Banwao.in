import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import mongoose from 'mongoose';
import User from '../src/models/User.js';
import ServiceCategory from '../src/models/ServiceCategory.js';
import ContractorProfile from '../src/models/ContractorProfile.js';
import Lead from '../src/models/Lead.js';

describe('Banwao Backend API Integration Tests', () => {
  beforeAll(async () => {
    // Connect to in-memory or test MongoDB database
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/banwao_test_db';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  it('GET /api/v1/health - should return status 200 and healthy message', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toContain('healthy');
  });

  it('POST /api/v1/auth/register-customer - should register a new customer', async () => {
    const email = `testcustomer_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register-customer')
      .send({
        name: 'Test Customer',
        email: email,
        phone: '+919999888877',
        password: 'Password123!'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(email);
    expect(res.body.token).toBeDefined();
  });

  it('POST /api/v1/auth/register-contractor - should register contractor and create profile in pending state', async () => {
    const email = `testcontractor_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register-contractor')
      .send({
        name: 'Test Contractor Owner',
        email: email,
        phone: '+919988776655',
        password: 'Password123!',
        businessName: 'Test Buildtech Pvt Ltd',
        experienceYears: 7,
        skills: ['Construction', 'Renovation'],
        serviceAreas: ['Noida Sector 62', 'Greater Noida West'],
        description: 'Quality construction services'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.role).toBe('contractor');

    // Verify profile created in DB
    const contractor = await ContractorProfile.findOne({ userId: res.body.user.id });
    expect(contractor).not.toBeNull();
    expect(contractor.verificationStatus).toBe('pending');
  });

  it('POST /api/v1/leads - guest customer can create lead enquiry and generate BNW ref number', async () => {
    // Ensure at least 1 category exists
    let cat = await ServiceCategory.findOne({ slug: 'new-construction' });
    if (!cat) {
      cat = await ServiceCategory.create({
        name: 'New House Construction',
        slug: 'new-construction',
        shortDesc: 'Test category'
      });
    }

    const res = await request(app)
      .post('/api/v1/leads')
      .send({
        serviceCategoryId: cat._id.toString(),
        propertyType: 'independent_house',
        workType: 'new_construction',
        city: 'Noida',
        sector: 'Sector 62',
        builtUpArea: 2400,
        budgetMin: 5000000,
        budgetMax: 7000000,
        constructionType: 'material_and_labour',
        description: 'Looking to construct 3 floor independent house with basement parking.',
        customerName: 'Guest Homeowner',
        customerPhone: '+919876500112',
        customerEmail: 'guesthomeowner@example.com'
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.lead.referenceNo).toMatch(/^BNW-\d{4}-\d{4}$/);
  });
});
