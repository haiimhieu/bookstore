import express from 'express'
import { Router } from 'express'
const app = express();
import cors from 'cors';
const port = 3000;
import bookRouter from './routes/books.js'
import genreRouter from './routes/genre.js'
import userRouter from './routes/users.js'
import reviewRouter from './routes/reviews.js'
import orderRouter from './routes/orders.js'
import session from "express-session";

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));

app.use(session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,       // true if using HTTPS
        httpOnly: true,
        sameSite: "lax"
    }
}));

const masterRouter = Router()
masterRouter.use('/books', bookRouter);
masterRouter.use('/genre', genreRouter);
masterRouter.use('/user', userRouter);
masterRouter.use('/reviews', reviewRouter);
masterRouter.use('/orders', orderRouter);


app.use('/api', masterRouter);


app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
