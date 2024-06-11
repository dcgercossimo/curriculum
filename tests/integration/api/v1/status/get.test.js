test('GET to /api/v1/status should return 200', async () => {
  const resp = await fetch('http://localhost:3000/api/v1/status');
  expect(resp.status).toBe(200);

  const responseBody = await resp.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database).toBeDefined();
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toBe('16.1');
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.active_connections).toBeDefined();
  expect(responseBody.dependencies.database.active_connections).toEqual(1);
  expect(responseBody.dependencies.database.max_connections).toBeGreaterThanOrEqual(
    responseBody.dependencies.database.active_connections,
  );
});
