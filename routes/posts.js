import express from 'express';
import Post from '../models/post.js';

const router = express.Router();

// show all posts

router.get('/', async (req, res) => {
  const posts = await Post.mostRecent();
  const preparedPosts = posts.map((el) => {
    return {
      ...el.toObject(),
      createdAt: el.createdAt.toLocaleString(),
      updatedAt: el.updatedAt?.toLocaleString(),
      isRedictable: el.user === req.session.user.name,
    }
  });
  if (posts.length !== 0) {
    res.render('posts/posts', { posts: preparedPosts });
  } else {
    res.render('posts/posts', { empty: true });
  }
});

//show create new post

router.get('/new', (req, res) => {
  res.render('posts/new');
})

router.post('/new', async (req, res) => {
  const { title, body } = req.body;
  const post = await Post.create({
    title,
    body,
    user: req.session.user.name,
    createdAt: new Date(),
  })
  res.redirect('/posts')
});

// show all post of session user

router.get('/user', async (req, res) => {
  const userPosts = await Post.find({ user: req.session.user.name });
  const preparedUserPosts = userPosts.map((el) => {
    return {
      ...el.toObject(),
      createdAt: el.createdAt.toLocaleString(),
      updatedAt: el.updatedAt?.toLocaleString(),
      isRedictable: el.user === req.session.user.name,
    }
  });
  if (userPosts.length !== 0) {
    res.render('posts/posts', { userPosts: preparedUserPosts })
  } else {
    res.render('posts/posts', { empty: true })
  }
})

//edit post

router.get('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render('posts/edit', { post })
});

router.put('/edit/:id', async (req, res) => {
  const post = await Post.findById(req.params.id);
  const { title, body } = req.body;
  post.title = title;
  post.body = body;
  post.updatedAt = Date.now();
  post.save()
  res.redirect('/posts');
});

// delete post 

router.delete('/delete/:id', async (req, res) => {
  await Post.deleteOne({ '_id': req.params.id })
  res.redirect('/posts');
});

// show all post of one user

router.get('/:user', async (req, res) => {
  const oneUserPosts = await Post.find({ user: req.params.user });
  res.render('posts/userPosts', { oneUserPosts, user: oneUserPosts[0].user });
});


export default router;
