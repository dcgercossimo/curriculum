import orchestrator from 'tests/orchestrator.js';
import { version as uuidVersion } from 'uuid';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

describe('PUT /api/v1/users/[username]/edit', () => {
  describe('Anonymous user', () => {
    test('Update user', async () => {
      const response1 = await fetch('http://localhost:3000/api/v1/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'AlterarUsuario',
          email: 'altera.email@aurealab.com.br',
          phone: '9999999999991',
          password: '123456',
        }),
      });
      expect(response1.status).toBe(201);

      const response2 = await fetch('http://localhost:3000/api/v1/users/AlterarUsuario/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'email.alterado@alterou.com',
          phone: '9999999999990',
        }),
      });
      expect(response2.status).toBe(205);

      const response3 = await fetch('http://localhost:3000/api/v1/users/AlterarUsuario');
      expect(response3.status).toBe(200);
      const responseBody3 = await response3.json();
      expect(responseBody3).toEqual({
        id: responseBody3.id,
        username: 'AlterarUsuario',
        email: 'email.alterado@alterou.com',
        phone: '9999999999990',
        password: responseBody3.password,
        created_at: responseBody3.created_at,
        updated_at: responseBody3.updated_at,
      });
      expect(uuidVersion(responseBody3.id)).toBe(4);
      expect(Date.parse(responseBody3.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody3.updated_at)).not.toBeNaN();
    }, 6000);
  });
});
