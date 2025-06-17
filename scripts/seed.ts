import DBquery from "@/db/connection";
import { transactions } from "@/utils/dev-data";

async function test() {
  try {
    console.log("Executing test");
    const result = await DBquery({
      text: "CREATE TABLE IF NOT EXISTS test (id SERIAL PRIMARY KEY)",
      params: [],
    });
    console.log(`Test success ${result}`);
  } catch (error) {
    console.error(`Seeding error ${error}`);
  }
}

async function seedTransactions() {
  const queryString = `
    INSERT INTO transactions (user_id, amount_cents, type, category_id, created_date, transaction_date, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7);
  `;

  for (const item of transactions) {
    try {
      const result = await DBquery({
        text: queryString,
        params: [
          item.userID,
          item.amountInCents,
          item.type,
          item.category,
          item.createdDate,
          item.transactionDate,
          item.description,
        ],
      });

      console.log(`Inserted: ${JSON.stringify(result)}`);
    } catch (e) {
      console.error(`Error inserting transaction: ${JSON.stringify(e)}`);
    }
  }
}

async function main() {
  seedTransactions();
}

main().catch((error) => console.error(error));
