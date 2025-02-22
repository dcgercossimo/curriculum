import migrationRunner from 'node-pg-migrate';
import { resolve } from 'node:path';
import database from 'infra/database';

const defaultMigrationConfig = {
  dir: resolve('infra', 'migrations'),
  direction: 'up',
  dryRun: true,
  verbose: true,
  migrationsTable: 'pgmigrations',
};

async function listPendingMigrations() {
  const dbClient = await database.getNewClient();
  try {
    const migrationConfig = {
      ...defaultMigrationConfig,
      dbClient: dbClient,
    };

    const pendingMigrations = await migrationRunner(migrationConfig);
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient();
  try {
    const migrationConfig = {
      ...defaultMigrationConfig,
      dbClient: dbClient,
      dryRun: false,
    };

    const migratedMigrations = await migrationRunner({
      ...migrationConfig,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
