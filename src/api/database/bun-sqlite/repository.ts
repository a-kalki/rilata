import { SQLQueryBindings } from 'bun:sqlite';
import { BunSqliteDatabase } from './database.ts';
import { MigrateRow, RepositoryRecord } from './types.ts';
import { Repository } from '../repository.ts';
import { DatabaseServiceStatus } from '../types.ts';
import { Logger } from '../../logger/logger.ts';
import { dtoUtility } from '../../../core/utils/dto/dto-utility.ts';

export abstract class BunSqliteRepository<
  TN extends string, R extends RepositoryRecord
> implements Repository<TN, R> {
  abstract tableName: TN;

  protected logger!: Logger;

  abstract migrationRows: MigrateRow[];

  /** Создать таблицу в БД */
  abstract create(): void

  constructor(protected db: BunSqliteDatabase) {}

  addBatch(records: R[]): { changes: number } {
    const colNames = dtoUtility.getKeys(records);

    const transaction = this.db.sqliteDb.transaction(() => {
      let totalChanges = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const rec of records) {
        const values = colNames.map((nm) => (this.isObject(rec[nm]) ? `json($${nm})` : `$${nm}`));
        const bindings = this.bindKeys(rec);
        const sql = `INSERT INTO ${this.tableName} (${colNames.join(',')}) VALUES (${values.join(',')})`;
        const result = this.db.sqliteDb.prepare(sql).run(bindings);
        totalChanges += result.changes;
      }
      return { changes: totalChanges };
    });

    return transaction(); // { changes: N }
  }

  isCreated(): boolean {
    return this.db.getAllTableNames().includes(this.tableName);
  }

  /** Выполнить миграцию для репозитория */
  migrate(): void {
    const migrationRepo = this.db.getMigrationRepo();
    this.migrationRows.forEach((mRow) => {
      if (migrationRepo.rowIsMigrated(mRow.id) === false) {
        try {
          const transaction = this.db.sqliteDb.transaction(() => {
            this.migrateTable(mRow);
            migrationRepo.registerMigration(mRow, this.tableName);
          });
          transaction();
          this.logger.info(`---| migrate "${mRow.description}" successfully processed`);
        } catch (e) {
          throw this.logger.error(
            `fail migrate "${mRow.description}" row`,
            mRow,
            e as Error,
          );
        }
      }
    });
  }

  clear(): void {
    this.db.sqliteDb.run(`DELETE FROM ${this.tableName}`);
  }

  getMigrateStatus(): DatabaseServiceStatus | 'notRequired' {
    if (!this.isCreated()) return 'none';
    if (this.migrationRows.length === 0) return 'notRequired';
    const mRepo = this.db.getMigrationRepo();
    const rowsIsMigrated = this.migrationRows.map((mRow) => mRepo.rowIsMigrated(mRow.id));
    const allRowsMigrated = rowsIsMigrated.every((isMigrated) => isMigrated);
    if (allRowsMigrated) return 'complete';
    const allRowsNotMigrated = rowsIsMigrated.every((isMigrated) => !isMigrated);
    return allRowsNotMigrated ? 'none' : 'partial';
  }

  /** Возвращает объект приведенный для привязки */
  protected bindKeys(obj: Record<string, unknown>): SQLQueryBindings {
    return dtoUtility.editKeys(obj, (k) => `$${k}`) as SQLQueryBindings;
  }

  protected isObject(value: unknown): boolean {
    return typeof value === 'object' && value !== null;
  }

  protected migrateTable(migration: MigrateRow): void {
    this.db.sqliteDb.run(migration.sql);
  }
}
