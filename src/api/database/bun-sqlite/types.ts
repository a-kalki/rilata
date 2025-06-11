import { UuidType } from '../../../core/types.ts';

export type MigrateRow = {
  id: UuidType,
  description: string,
  sql: string,
};

export type MigratingsRecord = MigrateRow & {
  tableName: string,
  migratedAt: number,
}

export type BunSqliteTransactionData = {
  cb: () => void;
  transactionId: UuidType,
  transactioinDescription: string,
  repositoryName: string,
}

export type RepositoryRecord = Record<string, string | number | null>
