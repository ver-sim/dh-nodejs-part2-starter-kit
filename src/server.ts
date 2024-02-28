import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import "express-async-errors";
import { addImg, create, deleteById, getAll, getOneById, updateById } from "./controllers/planets.js";
import multer from "multer";
import { logIn, logOut, signUp } from "./controllers/users.js";
import authorize from "./authorize.js";
import "./passport.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './upolads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage })

app.use(express.json());
app.use(morgan('dev'));



app.get('/api/planets', getAll);

app.get('/api/planets/:id', getOneById);

app.post('/api/planets', create);

app.put('/api/planets/:id', updateById);

app.delete('/api/planets/:id', deleteById);

app.post('/api/planets/:id/image', upload.single("image"), addImg);

app.post('/api/users/signup', signUp);
app.post('/api/users/login', logIn);
app.get('/api/users/logout', authorize, logOut);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

