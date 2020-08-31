import express from 'express';
import session from 'express-session';
import './misc/env.js';
import './misc/db.js';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';

// Import routes

const MongoStore = connectMongo(session);

const app = express();

app.set('view engine', 'hbs');
app.set('views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET_KEY,
  store: new MongoStore({
    mongooseConnection: './misc/db.js', //? 
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    httpOnly: true,
    secure: false,
    maxAge: null,
  }
}));

// Check session

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    console.log(req.session);
    console.log(req.cookies);
  }
  next();
})

// Routes

app.get('/logout', async (req, res) => {
  await req.session.destroy()
  res.redirect('/')
})


const port = process.env.PORT ?? 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
