const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db');

describe('API Tests', () => {
  afterAll(() => {
    db.close();
  });

  test('GET /api/products returns products', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
  });

  test('POST /api/checkout works', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ items: [{ productId: 1, quantity: 2 }] });
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Checkout successful');
    expect(res.body).toHaveProperty('total');
  });

  test('POST /api/checkout fails with empty items', async () => {
    const res = await request(app)
      .post('/api/checkout')
      .send({ items: [] });
    
    expect(res.statusCode).toBe(400);
  });
});
