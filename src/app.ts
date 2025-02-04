import dotenv, {config} from "dotenv";
import express, { Router } from "express";
import expresslayout from "express-ejs-layouts";
import connectDb from "./server/config/db.js";
import mainRouter from "./server/routes/main.js";
import adminRouter from "./server/routes/admin.js";
import mongoStore from "connect-mongo";
import session from "express-session";
import methodOverride from "method-override";

config({path: "./config.env"});
const app = express();
const PORT = process.env.PORT || 3000;
connectDb();



app.use(expresslayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended : true}));
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  //cookie: { maxAge: new Date ( Date.now() + (3600000) ) } 
}));
app.use(methodOverride("_method"));
app.use(express.json());
app.use('/admin', adminRouter);
app.use('/blogs', mainRouter);



app.listen(PORT, () => {
    console.log("Listening for requests");
});