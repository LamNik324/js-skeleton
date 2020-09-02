import express from 'express';
import session from 'express-session';
import './misc/env.js';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo';
import mongoose from 'mongoose';
import methodOverride from 'method-override';

// middlewares
import middlewearAuth from './middlewares/auth.js';
import middlewareNotFound from './middlewares/notFound.js';
import middlewareErrors from './middlewares/errors.js';

// Import routes
import authRouter from './routes/auth.js';
import mainRouter from './routes/main.js';
import postsRouter from './routes/posts.js';

const MongoStore = connectMongo(session);
mongoose.connect(process.env.MONGO_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
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
    mongooseConnection: mongoose.createConnection(process.env.MONGO_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }), //? 
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

app.use(methodOverride( (req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
}));

// Check session

app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user;
    // console.log('session',req.session);
    // console.log('cookie',req.cookies);
  }
  next();
})

// Routes
app.get('/', (req, res) => {
  res.render('registration');
});

app.use(authRouter);
app.use(middlewearAuth, mainRouter);
app.use('/posts', middlewearAuth, postsRouter);

app.get('/logout', async (req, res) => {
  await req.session.destroy()
  res.redirect('/');
}); 

app.use(middlewareNotFound);
app.use(middlewareErrors);


const port = process.env.PORT ?? 5000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
