import database from 'infra/database.js';
import { InternalServerError } from 'infra/errors.js';

async function status(req, res) {
  try {
    const updatedAt = new Date().toISOString();
    const databaseName = process.env.POSTGRES_DB;
    const activeConnections = await database.query({
      text: 'select count(*)::int AS active_connections from pg_stat_activity WHERE datname = $1;',
      values: [databaseName],
    });

    const version = await database.query('SHOW server_version;');
    const maxConnections = await database.query('SHOW max_connections;');

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: version.rows[0].server_version,
          max_connections: parseInt(maxConnections.rows[0].max_connections),
          active_connections: activeConnections.rows[0].active_connections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });
    console.log('/n Erro ao tentar acessar a rota /status');
    console.error(publicErrorObject);

    res.status(500).json(publicErrorObject);
  }
}

export default status;
