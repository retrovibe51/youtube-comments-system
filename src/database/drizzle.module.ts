import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import * as schema from '../database/schema';
import * as relations from '../database/relations';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool, {
  schema: {
    ...schema,
    ...relations,
  },
});

@Module({
  providers: [
    {
      provide: 'DRIZZLE_DB',
      useValue: db,
    },
  ],
  exports: ['DRIZZLE_DB'],
})
export class DrizzleModule {}
