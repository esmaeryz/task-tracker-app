import express from "express";
import DBCrud from "./utils/DBCrud.js";
import cors from "cors";
import { v4 } from "uuid";

const app = express();
const port = 8000;
const databaseLocation = "./mockDB.json";
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:8080",
  })
);

app.get("/", async (_, res) => {
  const { mockDatabaseReader } = DBCrud;

  const data = await mockDatabaseReader(databaseLocation);

  if (!data) {
    res.status(500).send({ message: "Internal server error" });
    return null;
  }

  res.send(data);
});

app.post("/", async (req, res) => {
  if (!req.body.name) {
    console.log(req.body);

    res.status(400).send({ message: "Invalid data" });
    return null;
  }

  const { mockDatabaseWriter, mockDatabaseReader } = DBCrud;

  const data = await mockDatabaseReader(databaseLocation);
  const newTask = req.body;
  data["tasks"].push({
    name: newTask.name,
    board: newTask.board,
    // I added a uuid to all the tasks
    // so that we have a value to distinguish them
    // Because users can create tasks with the same name
    // so name can not be a unique identifier
    id: v4(),
  });

  const updatedData = await mockDatabaseWriter(databaseLocation, data);

  res.send(updatedData);
});

// I take the id from the url to find the task to delete
app.delete("/:id", async (req, res) => {
  const { mockDatabaseReader, mockDatabaseWriter } = DBCrud;
  const { id } = req.params;

  const data = await mockDatabaseReader(databaseLocation);

  const updatedData = data["tasks"].filter((task) => task.id !== id);

  const newData = { tasks: updatedData };

  await mockDatabaseWriter(databaseLocation, newData);

  res.send({ message: "Task deleted" });
});

// I take the id from the url to find the task to update
app.put("/:id", async (req, res) => {
  const { mockDatabaseReader, mockDatabaseWriter } = DBCrud;
  const { id } = req.params;

  const data = await mockDatabaseReader(databaseLocation);

  const updatedData = data["tasks"].map((task) => {
    if (task.id === id) {
      task.name = req.body.name;
      task.board = req.body.board;
    }
    return task;
  });

  const newData = { tasks: updatedData };
  const updatedDataResponse = await mockDatabaseWriter(
    databaseLocation,
    newData
  );

  res.send(updatedDataResponse);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
