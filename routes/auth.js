import express from 'express';
import sha256 from 'sha256';
import User from '../models/user.js';

const router = express.Router();

//Registrations

router.get('/registration', (req, res) => {
  res.render('registration');
});

router.post('/registration', async (req, res) => {
  const { name, email } = req.body;
  const password = sha256(req.body.password);
  const passwordRepeat = sha256(req.body.passwordRepeat);
  if (password === password) {
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log(user);
    req.session.user = user;
    res.redirect('/main');
  } else {
    res.render('registration', { invalidPassword: true })
  }
});

//Login

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const password = sha256(req.body.password);
  const user = await User.findOne({ email });
  if (user) {
    if (user.password === password) {
      req.session.user = user;
      res.redirect('/main');
    } else {
      res.render('login', { invalidPassword: true });
    } 
  } else {
    res.render('login', {notFound: true});
  }
});

export default router;
