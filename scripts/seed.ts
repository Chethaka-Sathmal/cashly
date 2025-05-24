import DBquery from "@/db/connection";

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

async function main() {
  test();
}
main().catch((error) => console.error(error));
