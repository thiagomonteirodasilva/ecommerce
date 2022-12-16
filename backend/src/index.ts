import express from 'express';
import { routes } from './routes';
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(cors());
app.use(express.static("files"));
app.use(express.static('src/uploads')); //to load image uploaded URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes)

app.listen(8800, () => {
    console.log('Connected!')
})