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

