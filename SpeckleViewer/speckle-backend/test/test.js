const request = require('supertest');
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const router = require('../routes/speckleRoutes');
require('dotenv').config(); 

const app = express();
app.use(express.json());  
app.use(router);  

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/testDB');
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('API Routes', () => {

  // Test for POST /diff
  it('should return 400 if objectIds is not an array', async () => {
    const response = await request(app)
      .post('/diff')
      .send({ objectIds: 'not-an-array' });  // Send an incorrect type
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('objectIds must be an array');
  });

  it('should return object differences', async () => {
    const mockResponse = { differences: [] };
    // Mocking axios request
    jest.spyOn(axios, 'post').mockResolvedValueOnce({ data: mockResponse });

    const response = await request(app)
      .post('/diff')
      .send({ objectIds: ['objectId1', 'objectId2'] });
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  // Test for POST /upload
  it('should return 400 if no file is uploaded', async () => {
    const response = await request(app)
      .post('/upload')
      .send();  // No file sent
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('No file uploaded');
  });

  // Test for POST /download/list
  it('should return 400 if objectIds is not an array', async () => {
    const response = await request(app)
      .post('/download/list')
      .send({ objectIds: 'not-an-array' });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('objectIds must be an array');
  });
});
