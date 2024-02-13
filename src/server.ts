import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import { create, deleteById, getAll, getOneById, updateById } from "./controllers/planets.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(morgan('dev'));

app.get('/api/planets', getAll);

app.get('/api/planets/:id', getOneById);

app.post('/api/planets', create);

app.put('/api/planets/:id', updateById);

app.delete('/api/planets/:id', deleteById);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

