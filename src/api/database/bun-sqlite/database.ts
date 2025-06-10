/* eslint-disable no-use-before-define */
import { Database as SqliteDb } from 'bun:sqlite';
import { existsSync } from 'fs';
import { DatabaseServiceStatus, BatchRecords } from '#api/database/types.ts';
import { Logger } from '#api/logger/logger.ts';
import { MaybePromise } from '#core/types.ts';
import { consoleColor } from '#core/utils/string/console-color.ts';
import { Repository } from '#api/database/repository.ts';
import { Database } from '#api/database/database.ts';
import { MigrationsSqliteRepository } from './repositories/migrations.ts';
import { BunSqliteRepository } from './repository.ts';
import { RepositoryRecord } from './types.ts';

type BunRepoCtor = new (db: BunSqliteDatabase) => BunSqliteRepository<
  string,
  RepositoryRecord
>;

const MEMORY_PATH = ':memory:';

export class BunSqliteDatabase implements Database {
  protected migrationRepo: MigrationsSqliteRepository;

  protected sqliteDbInstance: SqliteDb | undefined;

  get sqliteDb(): SqliteDb {
    if (this.sqliteDbInstance) return this.sqliteDbInstance;
    throw this.logger.error('database not opened');
  }

  protected repositories: BunSqliteRepository<string, RepositoryRecord>[] = [];

  constructor(
    protected filePath: string,
    protected moduleName: string,
    protected RepositoriesCtors: BunRepoCtor[],
    protected logger: Logger,
  ) {
    this.migrationRepo = new MigrationsSqliteRepository(this);
    this.repositories = RepositoriesCtors.map((Ctor) => new Ctor(this));
    if (this.filePath === MEMORY_PATH) {
      this.createDb();
    } else {
      // открытие файла приводит к создание файла БД
      // так что запуск в режиме prod, автоматически приводит к созданию файла
      // но он все еще требует физического создания таблиц и т.д.
      this.open();
    }
  }

  addRepository(repo: BunSqliteRepository<string, RepositoryRecord>): void {
    this.repositories.push(repo);
  }

  /** Создать файл БД и таблицы. */
  createDb(): void {
    this.logger.info(`create db "${this.filePath}" for module: "${this.moduleName}" started`);
    this.openSqliteDb();
    if (this.creationStatus() !== 'none') {
      throw this.logger.error(
        `database ${this.filePath} for module: ${this.moduleName} has already been created.`,
      );
    }
    this.createRepositories();
    this.migrateDb();
    this.logger.info(`create db "${this.filePath}" for module: "${this.moduleName}" finished`);
  }

  async getStatusAsString(needPaint?: boolean): Promise<string> {
    const toBright = (s: string): string => (needPaint ? consoleColor.bright(s) : s);
    const toColor = (s: string): string => (
      needPaint
        ? ['complete', 'notRequired', 'true'].includes(s)
          ? consoleColor.fgColor(s, 'Green')
          : consoleColor.fgColor(s, 'Red')
        : s
    );

    const dbName = toBright(`module name: ${(this.moduleName)}`);
    const dbCreateStatus = `db creation status = ${toColor(this.creationStatus())}`;
    const dbMigrateStatus = `db migration status = ${toColor(await this.migrationStatus())}`;
    const dbRepositoriesStatuses = `db repositories:\n${
      this.getRepositories()
        .map((repo) => ({
          name: toBright(repo.tableName),
          isCreated: toColor(String(repo.isCreated())),
          migrationStatus: toColor(repo.getMigrateStatus()),
        }))
        .map((rec) => `  repo name: ${rec.name}\n    repo is created = ${rec.isCreated}\n    repo migrate status = ${rec.migrationStatus}`)
        .join('\n')
    }`;
    return `${dbName}\n${dbCreateStatus}\n${dbMigrateStatus}\n${dbRepositoriesStatuses}`;
  }

  creationStatus(): DatabaseServiceStatus {
    const repoCreations = this.getRepositories().map((r) => r.isCreated());
    const allCreated = repoCreations.every((repoCreated) => repoCreated);
    if (allCreated) return 'complete';
    const noneHaveBeenCreated = repoCreations.every((repoCreated) => !repoCreated);
    return noneHaveBeenCreated ? 'none' : 'partial';
  }

  migrateDb(): MaybePromise<void> {
    this.getRepositories().forEach((repo) => {
      this.logger.info(`-| migrate for repo: "${repo.tableName}" started`);
      repo.migrate();
      this.logger.info(`-| migrate for repo: "${repo.tableName}" finished`);
    });
  }

  migrationStatus(): MaybePromise<DatabaseServiceStatus> {
    const repoMigrateStatuses = this.getRepositories().map((r) => r.getMigrateStatus());
    const allMigrated = repoMigrateStatuses.every((status) => ['complete', 'notRequired'].includes(status));
    if (allMigrated) return 'complete';
    const allReposNotMigrated = repoMigrateStatuses.every((status) => status === 'none');
    return allReposNotMigrated ? 'none' : 'partial';
  }

  getAllTableNames(): string[] {
    const sql = "SELECT name FROM sqlite_master WHERE type='table'";
    const tables = this.sqliteDb.query<{ name: string }, []>(sql).all();
    return tables.map((tbl) => tbl.name);
  }

  getMigrationRepo(): MigrationsSqliteRepository {
    return this.migrationRepo;
  }

  open(): void {
    this.openSqliteDb();
  }

  getRepositories(): BunSqliteRepository<string, RepositoryRecord>[] {
    return [this.migrationRepo, ...this.repositories];
  }

  getRepository<R extends BunSqliteRepository<string, RepositoryRecord>>(name: R['tableName']): R {
    const repo = this.repositories.find((r) => r.tableName === name);
    if (!repo) {
      throw this.logger.error(
        `cannot finded repository by name: "${name}"`,
      );
    }
    return repo as R;
  }

  addBatch<R extends Repository<string, RepositoryRecord>>(
    batchRecords: BatchRecords<R>,
  ): { changes: number }[] {
    return Object.entries(batchRecords).map(([tableName, records]) => {
      const repo = this.getRepository(tableName);
      return repo.addBatch(records as RepositoryRecord[]);
    });
  }

  async clearDb(): Promise<void> {
    const transaction = this.sqliteDb.transaction(async () => {
      const promises = this.getRepositories().map((repo) => repo.clear());
      await Promise.all(promises);
    });
    await transaction();
    this.logger.info(`sqlite db for module "${this.moduleName}" cleared`);
  }

  stop(): void {
    this.sqliteDb?.close();
  }

  protected createRepositories(): void {
    this.migrationRepo.create();
    this.repositories.forEach((repo) => {
      repo.create();
      this.logger.info(`-| repo: "${repo.tableName}" successfully created`);
    });
  }

  protected openSqliteDb(): void {
    if (!this.sqliteDbInstance) {
      this.sqliteDbInstance = new SqliteDb(this.filePath);
      this.logger.info(`-| sqlite db by name "${this.filePath}" for module "${this.moduleName}" opened`);
    }
  }

  protected dbFileIsExist(): boolean {
    return existsSync(this.filePath);
  }
}
