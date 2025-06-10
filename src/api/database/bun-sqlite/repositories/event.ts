import { Changes } from 'bun:sqlite';
import { EventRepository } from '#api/database/event.repository.ts';
import { ArPublishEvent } from '#domain/meta-types.ts';
import { BunSqliteRepository } from '../repository.ts';
import { MigrateRow } from '../types.ts';

type EventRecord = {
  id: string,
  name: string,
  payload: string,
  requestId: string,
  isPublished: 0 | 1,
  aRootName: string,
  aRootId: string,
}

export class EventRepositorySqlite
  extends BunSqliteRepository<'events', EventRecord>
  implements EventRepository {
  tableName = 'events' as const;

  migrationRows: MigrateRow[] = [];

  create(): void {
    this.db.sqliteDb.run(
      `CREATE TABLE ${this.tableName} (
        id TEXT(36) PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        requestId TEXT(36) NOT NULL,
        attrs TEXT NOT NULL,
        caller: TEXT NOT NULL,
        aRootName TEXT NOT NULL,
        aRootId TEXT(36) NOT NULL,
        aRootVersion TEXT NOT NULL,
        createdAt: INTEGER NOT NULL,
        isPublished INTEGER NOT NULL CHECK (isPublished IN (0, 1))
      );
      CREATE INDEX eventsReqIdIndex ON ${this.tableName} (requestId);
      CREATE INDEX eventsArootIdIndex ON ${this.tableName} (aRootId);
      CREATE INDEX eventsIsPblshIndex ON ${this.tableName} (isPublished) WHERE isPublished=0; `,
    );
  }

  addEvents(events: ArPublishEvent[]): Changes {
    const sql = `INSERT INTO ${this.tableName} VALUES (
      $id, $name, $requestId, $attrs, $caller, $aRootName, $aRootId, $aRootVersion, $createdAt, $isPublished
    )`;
    const addEvent = this.db.sqliteDb.prepare(sql);
    const addEventsTransaction = this.db.sqliteDb.transaction((tEvents: ArPublishEvent[]) => {
      tEvents.forEach((event) => {
        const attrs = {
          $id: event.id,
          $name: event.name,
          $requestId: event.requestId,
          $attrs: JSON.stringify(event.attrs),
          $caller: JSON.stringify(event.caller),
          $aRootName: event.aRootName,
          $aRootId: event.aRootId,
          $aRootVersion: event.aRootVersion,
          $createdAt: event.createdAt,
          $isPublished: 0,
        };
        addEvent.run(attrs);
      });
    });
    return addEventsTransaction(events);
  }

  getAggregateEvents(aRootId: string): ArPublishEvent[] {
    const sql = `SELECT payload FROM ${this.tableName} WHERE aRootId='${aRootId}'`;
    const plds = this.db.sqliteDb.prepare(sql).all() as { payload: string }[];
    return plds.map((pld) => JSON.parse(pld.payload)) as ArPublishEvent[];
  }

  findEvent(id: string): ArPublishEvent | undefined {
    const sql = `SELECT payload FROM ${this.tableName} WHERE id='${id}'`;
    const result = this.db.sqliteDb.query(sql).get() as { payload: string } | undefined;
    if (!result) return undefined;
    return JSON.parse(result.payload);
  }

  isExist(id: string): boolean {
    const sql = `SELECT id FROM ${this.tableName} WHERE id='${id}'`;
    return Boolean(this.db.sqliteDb.query(sql).get());
  }

  getNotPublished(): ArPublishEvent[] {
    const sql = `
      SELECT *
      FROM ${this.tableName}
      WHERE isPublished=0 
    `;
    return this.db.sqliteDb.query(sql).all() as ArPublishEvent[];
  }

  markAsPublished(id: string): { count: number } {
    const sql = `UPDATE ${this.tableName} SET isPublished=1 WHERE id='${id}'`;
    this.db.sqliteDb.run(sql);
    return this.db.sqliteDb.query(`SELECT CHANGES() as count FROM ${this.tableName}`).get() as { count: number };
  }
}
