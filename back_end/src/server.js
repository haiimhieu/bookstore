import express from 'express'
import { Router } from 'express'
import cors from 'cors';
import bookRouter from './routes/books.js'
import genreRouter from './routes/genre.js'
import userRouter from './routes/users.js'
import reviewRouter from './routes/reviews.js'
import orderRouter from './routes/orders.js'
import session from "express-session";
const app = express();
const port = 3000;

// Settings for app and cross connections
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));

// Establish Session
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


// Establish different routes and master router
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
