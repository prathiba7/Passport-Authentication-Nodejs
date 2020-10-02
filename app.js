const express=require('express');
const expressLayouts=require('express-ejs-Layouts');
const flash=require('connect-flash');
const session=require('express-session');
const passport=require('passport');
const mongoose=require('mongoose');
//passport congig

require('./config/passport')(passport);
const app=express();
//connect to db
const db=require('./config/keys').MongoURI;



mongoose.connect(db,{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>console.log('MongoDb Connected...'))
.catch(err=>console.log(err));


//ejs
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser
app.use(express.urlencoded({extended:false}));

//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,

  }));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//connect flash
app.use(flash());

//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg');
    res.locals.error_msg=req.flash('error_msg');
    res.locals.error=req.flash('error');
    next();
});

//router
app.use('/',require('./routes/index'));

app.use('/users',require('./routes/user'));

const PORT=process.env.PORT||5000;

app.listen(PORT,console.log(`server start on port ${PORT}`));