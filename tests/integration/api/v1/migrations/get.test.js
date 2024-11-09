import database from 'infra/database';
import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await database.query('drop schema public cascade; create schema public;');
});

test('GET to /api/v1/migrations should return 200', async () => {
  const resp = await fetch('http://localhost:3000/api/v1/migrations');
  expect(resp.status).toBe(200);

  const respBody = await resp.json();
  expect(Array.isArray(respBody)).toBe(true);
  expect(respBody.length).toBeGreaterThan(0);
});
