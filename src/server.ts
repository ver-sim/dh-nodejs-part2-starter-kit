import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import Joi from "joi";

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


const planetSchema = Joi.object({
  id: Joi.number().integer().required(),
  name: Joi.string().required(),
})

app.use(express.json());

app.use(morgan('dev'));

app.get('/api/planets', (req, res) => {
    res.status(200).json(planets);  
});

app.get('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  const planet = planets.find((p) => p.id === Number(id));

  res.status(200).json(planet);
});

app.post('/api/planets', (req, res) => {
  const { error, value} = planetSchema.validate(req.body);
  const newPlanet: Planet = {
    id: value.id,
    name: value.name,
  }
  planets = [...planets, newPlanet];

  if(error){
    return res.status(400).json({ error: error.details[0].message});
  } else {
    res.status(201).json({msg: 'create a new planet'});
  }
});

app.put('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  planets = planets.map((p) => p.id === Number(id) ? ({...p, name}) : p);
  
  res.status(200).json({ msg: 'update planet'});
});

app.delete('/api/planets/:id', (req, res) => {
  const { id } = req.params;
  planets = planets.filter((p) => p.id !== Number(id));

  res.status(200).json({ msg: 'planet deleted'});
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

