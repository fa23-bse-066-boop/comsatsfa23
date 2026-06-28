import { DataSourceOptions } from 'typeorm';
import { PostgresNote } from './entities/postgres-note.entity';
import { CreatePostgresNotesTable1751106000000 } from './migrations/1751106000000-create-postgres-notes-table';

type PgSslMode = 'disable' | 'require' | 'verify-full';

function parseNumber(value: string | undefined, fallback: number): number {
  const parsedValue = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsedValue) ? parsedValue : fallback;
}

function getSslOptions(mode: PgSslMode): false | { rejectUnauthorized: boolean } {
  if (mode === 'disable') {
    return false;
  }

  return {
    rejectUnauthorized: mode === 'verify-full',
  };
}

export function buildPostgresDataSourceOptions(): DataSourceOptions {
  const sslMode = (process.env['POSTGRES_SSL_MODE'] as PgSslMode | undefined) ?? 'disable';
  const connectionTimeoutMs = parseNumber(
    process.env['POSTGRES_CONNECT_TIMEOUT_MS'],
    10000,
  );
  const poolMax = parseNumber(process.env['POSTGRES_POOL_MAX'], 10);

  return {
    type: 'postgres',
    ...(process.env['POSTGRES_URL']
      ? { url: process.env['POSTGRES_URL'] }
      : {
          host: process.env['POSTGRES_HOST'] ?? 'localhost',
          port: parseNumber(process.env['POSTGRES_PORT'], 5432),
          username: process.env['POSTGRES_USER'] ?? 'dcms_app',
          password: process.env['POSTGRES_PASSWORD'] ?? 'dcms_password_change_me',
          database: process.env['POSTGRES_DB'] ?? 'dcms',
        }),
    entities: [PostgresNote],
    migrations: [CreatePostgresNotesTable1751106000000],
    migrationsRun: true,
    synchronize: false,
    retryAttempts: 3,
    retryDelay: 2000,
    logging: (process.env['POSTGRES_LOGGING'] ?? 'false') === 'true',
    ssl: getSslOptions(sslMode),
    extra: {
      max: poolMax,
      connectionTimeoutMillis: connectionTimeoutMs,
    },
  };
}
