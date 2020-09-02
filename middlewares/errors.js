export default (err, req, res, next) => {
  console.error('Error >>>>>>>',err);
  res.status(500).render('error');
};
