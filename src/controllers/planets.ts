import { Request, Response } from "express";
import Joi from "joi";
import { loadavg } from "os";
import pgPromise from "pg-promise";

const db = pgPromise()("postgres://postgres:postgres@localhost:5432/planet");

const setupDB = async () => {
  await db.none(`
    DROP TABLE IF EXISTS planets;

    CREATE TABLE planets (
      id SERIAL NOT NULL PRIMARY KEY,
      name TEXT NOT NULL,
      image TEXT
    );
  `)

  await db.none(`INSERT INTO planets (name) VALUES ('Earth')`);
  await db.none(`INSERT INTO planets (name) VALUES ('Mars')`);
}

setupDB();

const getAll = async (req: Request, res: Response) => {
  const planets = await db.many(`SELECT * FROM planets;`)  
  res.status(200).json(planets); 
}

const getOneById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const planet = await db.one(`SELECT * FROM planets WHERE id=$1;`, Number(id));
    
  res.status(200).json(planet);
}

const planetSchema = Joi.object({
  name: Joi.string().required(),
})

const create = async (req: Request, res: Response) => {
  const { error, value} = planetSchema.validate(req.body);
  const newPlanet = {
    name: value.name,
  }

    if(error){
        return res.status(400).json({ msg: error.details[0].message});
    } else {
     await db.none(`INSERT INTO planets (name) VALUES ($1)`, newPlanet.name);
     res.status(201).json({msg: 'create a new planet'});
    }
}

const updateById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    
    await db.none(`UPDATE planets SET name=$2 WHERE id=$1`, [id, name]);

    res.status(200).json({ msg: 'update planet'});
}

const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;
    
    await db.none(`DELETE FROM planets WHERE id=$1`, Number(id));

    res.status(200).json({ msg: 'planet deleted'});
}

const addImg = async (req: Request, res: Response) => {
  const { id } = req.params;
  const fileName = req.file?.path;
  // console.log(id)
  // console.log(fileName)
  console.log(req.file);

  if (fileName) {
    db.none(`UPDATE planets SET image=$2 WHERE id=$1`, [id, fileName]);
    res.status(201).json({ masg: 'planet image upload'});
  } else {
    res.status(400).json({ msg: 'planet image not upload'})
  }  
  
  
}
export { getAll, getOneById, create, updateById, deleteById, addImg };
