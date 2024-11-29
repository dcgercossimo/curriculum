import database from 'infra/database';
import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query('drop schema public cascade; create schema public;');
});

async function getMigrations() {
  return await database.query('select count(*) as migrations from pgmigrations;');
}

describe('POST /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    describe('Running pending migrations', () => {
      test('First time', async () => {
        const resp = await fetch('http://localhost:3000/api/v1/migrations', {
          method: 'POST',
        });
        expect(resp.status).toBe(201);

        const respBody = await resp.json();
        expect(Array.isArray(respBody)).toBe(true);
        expect(respBody.length).toBeGreaterThan(0);
      }, 6000);
      test('Second time', async () => {
        const resp = await fetch('http://localhost:3000/api/v1/migrations', {
          method: 'POST',
        });
        expect(resp.status).toBe(200);

        const respBody = await resp.json();
        expect(Array.isArray(respBody)).toBe(true);
        expect(respBody.length).toBe(0);

        const migrations = await getMigrations();
        expect(parseInt(migrations.rows[0].migrations)).toBeGreaterThan(0);
      }, 6000);
    });
  });
});
