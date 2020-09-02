import express from 'express';

const router = express.Router();

router.get('/main', (req, res) => {
  res.render('main');
});

export default router;
