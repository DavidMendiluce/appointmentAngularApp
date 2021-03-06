const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require("path");

const {mongoose} = require('./db.js');
var appointmentsController = require('./controllers/appointmentsController.js');
var locationsController = require('./controllers/locationsController.js');
const userRoutes = require('./routes/user');

var app = express();
app.use(bodyParser.json());
app.use(cors({origin: 'http://localhost:4200'}));

//app.listen(3000, () => console.log('Server started at port: 3000'));

if(process.env.NODE_ENV === 'production') {
  app.use(express.static("build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "build", "index.html"));
  });
}

app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

app.use('/appointments', appointmentsController);

app.use('/locations', locationsController);

app.options('*', cors());

app.use("/api/user", userRoutes);