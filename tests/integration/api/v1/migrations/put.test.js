import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe('PUT /api/v1/migrations', () => {
  describe('Anonymous user', () => {
    test('Put migrations', async () => {
      const resp = await fetch('http://localhost:3000/api/v1/migrations', {
        method: 'PUT',
      });
      expect(resp.status).toBe(405);

      const responseBody = await resp.json();
      expect(responseBody).toEqual({
        name: 'MethodNotAllowedError',
        message: 'Método não permitido para este endpoint.',
        action: 'Verifique se o método HTTP utilizado é suportado pela rota',
        statusCode: 405,
      });
    });
  });
});
