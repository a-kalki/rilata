import { MaybePromise } from '../../../core/types.ts';
import { DatabaseServiceManager } from '../db-service-manager.ts';
import { SqlMethod } from '../types.ts';
import { BunSqliteDatabase } from './database.ts';

export class BunSqliteDatabaseManager extends DatabaseServiceManager {
  sql<R>(moduleName: string, sql: string, method: SqlMethod): MaybePromise<R | undefined> {
    try {
      const dbRows = this.getDbServiceRows([moduleName]);
      if (dbRows.length === 0) {
        this.output(`Не найден модуль с именем: ${this.toGreen(moduleName)}`);
        return undefined;
      }
      const db = (dbRows[0].db as BunSqliteDatabase).sqliteDb;
      return db.query(sql)[method]() as R;
    } catch (e) {
      this.output(`\nОшибка при выполнении sql запроса: ${this.toGreen(sql)}. ${this.toRed((e as Error).message)}\n`);
      throw e;
    }
  }
}
