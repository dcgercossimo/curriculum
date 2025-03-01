import orchestrator from 'tests/orchestrator.js';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('POST /api/v1/users', () => {
  describe('Anonymous user', () => {
    test('With unique and valid data', async () => {
      const resp = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'DanielGercossimo',
          email: 'dcgercossimo@gmail.com',
          password: '123456',
        }),
      });
      expect(resp.status).toBe(201);

      const responseBody = await resp.json();
      expect(responseBody).toEqual({
        id: responseBody.id,
        username: 'DanielGercossimo',
        email: 'dcgercossimo@gmail.com',
        password: '123456',
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();
    }, 6000);
  });
});
