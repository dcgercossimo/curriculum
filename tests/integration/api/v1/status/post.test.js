import orchestrator from 'tests/orchestrator.js';

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

describe('POST /api/v1/status', () => {
  describe('Anonymous user', () => {
    test('Retrieving current system status', async () => {
      const resp = await fetch('http://localhost:3000/api/v1/status', {
        method: 'POST',
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
