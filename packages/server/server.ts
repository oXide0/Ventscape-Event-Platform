import cors from 'cors';
import express from 'express';
import router from './routes/router';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
// import { Event } from 'shared';
config();

const app = express();
const port = process.env.PORT || 5000;
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
