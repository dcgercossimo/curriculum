import database from 'infra/database';
import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query('drop schema public cascade; create schema public;');
});

async function getMigrations() {
  return await database.query('select count(*) as migrations from pgmigrations;');
}

test('POST to /api/v1/migrations should return 200', async () => {
  const resp = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  });
  expect(resp.status).toBe(201);

  const respBody = await resp.json();
  expect(Array.isArray(respBody)).toBe(true);
  expect(respBody.length).toBeGreaterThan(0);

  const resp2 = await fetch('http://localhost:3000/api/v1/migrations', {
    method: 'POST',
  });
  expect(resp2.status).toBe(200);

  const resp2Body = await resp2.json();
  expect(Array.isArray(resp2Body)).toBe(true);
  expect(resp2Body.length).toBe(0);

  const migrations = await getMigrations();
  expect(parseInt(migrations.rows[0].migrations)).toBeGreaterThan(0);
}, 6000);
