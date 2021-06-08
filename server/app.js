const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require('path');

require('dotenv/config');

// Internal routes for the web manager
const authRoute = require('./routes/internal/auth');
const usersRoute = require('./routes/internal/users');
const adminRoute = require('./routes/internal/admin');
const productsRoute = require('./routes/internal/products');
const keysRoute = require('./routes/internal/keys');

// Your public API
const publicRoute = require('./routes/public'); // public api route

app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json());

// Route middlware
app.use('/rest/auth', authRoute);
app.use('/rest/users', usersRoute);
app.use('/rest/admin', adminRoute);
app.use('/rest/products', productsRoute);
app.use('/rest/keys', keysRoute);
app.use(`/public-api/${process.env.API_VERSION}`, publicRoute);

// Catch-all solution for nudolio-react
app.use('/*', (_, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
})

// Connect to db
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true }, ()=>{
	console.log('connected to db');
});


// Listening
app.listen(process.env.PORT || 3000);