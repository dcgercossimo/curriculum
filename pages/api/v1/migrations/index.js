import { createRouter } from 'next-connect';
import migrationRunner from 'node-pg-migrate';
import { resolve } from 'node:path';
import database from 'infra/database';
import controller from 'infra/controller';

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorHandlers);

const defaultMigrationConfig = {
  dir: resolve('infra', 'migrations'),
  direction: 'up',
  dryRun: true,
  verbose: true,
  migrationsTable: 'pgmigrations',
};

async function getHandler(req, res) {
  const dbClient = await database.getNewClient();
  try {
    const migrationConfig = {
      ...defaultMigrationConfig,
      dbClient: dbClient,
    };

    const pendingMigrations = await migrationRunner(migrationConfig);
    return res.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
}

async function postHandler(req, res) {
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

    return migratedMigrations.length > 0
      ? res.status(201).json(migratedMigrations)
      : res.status(200).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
}
