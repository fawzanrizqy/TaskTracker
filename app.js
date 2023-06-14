const express = require('express')
const app = express()
const port = 3000
const route = require("./routes/route.js");
const  session  = require('express-session');

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

app.use('/', route);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})