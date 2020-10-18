const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path')
const authorRoutes = require('./routes/authors');
const novelRoutes = require('./routes/novels');
const partsRoutes = require('./routes/parts');
const passport = require('passport');
const localStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const Author = require('./models/authorModel');
const cors = require('cors');
const keys = require('./keys') //add your ouwn mongoUri Key file

require('dotenv').config()

mongoose.connect(keys.mongoURI,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
      
    }
,function(err) {
    if (err) {
        console.log("Database Not Connected", err);
    } else {
        console.log("Atlas Connected")
    }
});

const port = 8000;
const app = express();
app.use(cors());
app.set('view engine','ejs');
app.use(require('express-session')({
    secret: "Old Monks",
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

require('./config/passport')(passport);
//app.use(passport.session());
app.use(express.static(__dirname+'/public'));
// passport.use(new localStrategy(Author.authenticate()));
// passport.serializeUser(Author.serializeUser());
// passport.deserializeUser(Author.deserializeUser());
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
app.use('/author',authorRoutes);
app.use('/novels',novelRoutes);
app.use('/parts',partsRoutes);

app.use(morgan('dev'));


app.use(express.static(path.join(__dirname,'client', 'build')))
app.get('*',(req,res) => {
  res.sendFile(path.join(__dirname,'client', 'build', 'index.html'))
})


app.listen(port, ()=>{
    console.log('Server is up on port: ',port);
});