import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors"

dotenv.config();

const app = express();
const port = process.env.PORT;

type Planet = {
    id: number,
    name: string,
  };

  type Planets = Planet[];

  let planets: Planets = [
    {
      id: 1,
      name: "Earth",
    },
    {
      id: 2,
      name: "Mars",
    },
  ];

app.use(express.json());

app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.json(planets);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })

