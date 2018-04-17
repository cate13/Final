// Express Setup
const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];  
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;

if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

app.post('/api/login', (req, res) => {
    if (!req.body.email || !req.body.password)
      return res.status(400).send();
    knex('users').where('email',req.body.email).first().then(user => {
      if (user === undefined) {
        res.status(403).send("Invalid credentials");
        throw new Error('abort');
      }
      return [bcrypt.compare(req.body.password, user.hash),user];
    }).spread((result,user) => {
      if (result) {
        let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
        res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
      } else {
        res.status(403).send("Invalid credentials");
      }
        res.status(403).send("Invalid credentials");
      return;
    }).catch(error => {
      if (error.message !== 'abort') {
        console.log(error);
        res.status(500).json({ error });
      }
    });
  });

  app.post('/api/users', (req, res) => {
    if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
      return res.status(400).send();
    knex('users').where('email',req.body.email).first().then(user => {
      if (user !== undefined) {
        res.status(403).send("Email address already exists");
        throw new Error('abort');
      }
      return knex('users').where('username',req.body.username).first();
    }).then(user => {
      if (user !== undefined) {
        res.status(409).send("User name already exists");
        throw new Error('abort');
      }
      return bcrypt.hash(req.body.password, saltRounds);
    }).then(hash => {
      return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
                   name:req.body.name, role: 'user'});
    }).then(ids => {
      return knex('users').where('id',ids[0]).first().select('username','name','id');
    }).then(user => {
      
      let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({user:user,token:token});
      return;
    }).catch(error => {
      if (error.message !== 'abort') {
        console.log(error);
        res.status(500).json({ error });
      }
    });
  });

  app.get('/api/users/:id/comments', (req, res) => {
    let id = parseInt(req.params.id);
    knex('users').join('comments','users.id','comments.user_id')
      .where('users.id',id)
      .orderBy('created','desc')
      .select('comment','username','name','created').then(comments => {
        res.status(200).json({comments:comments});
      }).catch(error => {
        res.status(500).json({ error });
      });
  });

  app.get('/api/comments', (req, res) => {
    let offset = 0;
    if (req.query.offset)
      offset = parseInt(req.query.offset);
    let limit = 50;
    if (req.query.limit)
      limit = parseInt(req.query.limit);
    knex('users').join('comments','users.id','comments.user_id')
      .orderBy('created','desc')
      .limit(limit)
      .offset(offset)
      .select('comment','username','name','created').then(comments => {
        res.status(200).json({comments:comments});
      }).catch(error => {
        res.status(500).json({ error });
      });
  });

  app.post('/api/users/:id/comments', verifyToken, (req, res) => {
    let id = parseInt(req.params.id);
    if (id !== req.userID) {
      res.status(403).send();
      return;
    }
    knex('users').where('id',id).first().then(user => {
      return knex('comments').insert({user_id: id, comment:req.body.comment, created: new Date()});
    }).then(ids => {
      return knex('comments').where('id',ids[0]).first();
    }).then(comment => {
      res.status(200).json({comment:comment});
      return;
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    });
  });

app.listen(3000, () => console.log('Server listening on port 3000!'));