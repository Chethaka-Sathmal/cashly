import { Pool, QueryResultRow } from "pg";

/* 
  Use if causes an error 
*/
// declare global {
//   // this lets us reuse the pool in dev mode without re-creating it
//   var pgPool: Pool | undefined;
// }

// const pool =
//   global.pgPool ??
//   new Pool({
//     connectionString: process.env.DATABASE_URL,
//     ssl: true,
//   });

// if (process.env.NODE_ENV !== "production") global.pgPool = pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

export default async function DBquery<T extends QueryResultRow>({
  text,
  params,
}: {
  text: string;
  params: any[];
}): Promise<T[]> {
  try {
    const result = await pool.query<T>(text, params);
    return result.rows;
  } catch (error) {
    console.error(`Database error:`, error);
    throw error;
  }
}
