//dependencies
const express = require('express');
const expressHandlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const users = require('./users')
const app = express()

//set view engine

app.engine('handlebars', expressHandlebars());
app.set('views', './views');
app.set('view engine', 'handlebars')


//middleware

app.use(
  session({
    secret: 'emmais.the.coolest.ever',
    resave: false,
    saveUninitialized: true
  })
);

//maybe use morgan, look further into the details

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(expressValidator());

app.get('/', (req, res) => {
if (!req.session.user) {
  res.render('login')
} else {
  res.render('home', {
    user: req.session.user
  })
}
});

//endpoints
app.get('/login', function(req, res) {
  res.render('login')
});
//
// app.get('/welcome', function(req, res) {
//   res.render('welcome', {
//
//     username: username
//
//   });
// });

//Now we can run validation on form input
app.post('/login', function(req, res) {
  // let userInfo = req.session.body;

  req.checkBody('username', 'dude, you need a username').notEmpty();
  req.checkBody('password', 'dude, you need a password').notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    console.log(errors);
    res.render('/login', {
      errors: errors
    });

  } else {

    let players = users.filter(function(userCheck){
      return userCheck.username === req.body.username;
    });
    console.log(players);

    if (players === undefined || players.length === 0 ){
      let invalidUser = "Dude you don't exist."
      res.send(invalidUser);
    }
  }

  let control = users[0];

  if (control.password === req.body.password){
    req.session.user = control.username;
    res.redirect('/');
  } else {
    let notPassword = "Dude you need a password."
    res.send(notPassword);
  }
});
    // for (var i = 0; i < users.length; i++) {
    //   let userNameLink === req.body.username
    //   let passwordLink === req.body.password
    //     if(usernameLink === users[i].username && passwordLink === users[i].password ){
    //   res.redirect('/welcome')
    // } else {
    //   let needUsername = 'dude you need a username'
    // res.resolve('/', { userInfo : needUsername})
    // }

app.listen(3000);
console.log('listening at port:3000');
