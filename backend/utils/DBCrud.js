import fs from "fs/promises";

async function mockDatabaseReader(jsonPath) {
  try {
    const data = await fs.readFile(jsonPath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Data fetched");
  }
}

async function mockDatabaseWriter(jsonPath, data) {
  try {
    await fs.writeFile(jsonPath, JSON.stringify(data));
    const updatedData = await mockDatabaseReader(jsonPath);
    return updatedData;
  } catch (err) {
    console.error(err);
  } finally {
    console.log("Data inserted");
  }
}

export default { mockDatabaseReader, mockDatabaseWriter };
