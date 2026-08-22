import request from 'supertest';
import app from '../src/app';

describe('GET /api/v1/health', () => {
  it('should return 200 OK with health status UP', async () => {
    const response = await request(app).get('/api/v1/health');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('UP');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('uptime');
  });

  it('should return 404 for non-existent route', async () => {
    const response = await request(app).get('/api/v1/non-existent-endpoint');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.errorCode).toBe('NOT_FOUND');
  });
});
