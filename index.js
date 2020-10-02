const express = require('express');
const app = express();

const dotenv = require('dotenv');

// load config
dotenv.config({ path: './Env/config.env' });

const mongoose = require('mongoose');

const postRoute = require('./Routes/route');


// color console
const chalk = require('chalk');

const cors = require('cors');


mongoose.connect('mongodb://localhost:27017/One', {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log(chalk.blueBright('DATABASE CONNECTED'));
});

app.use(express.json());
app.use(cors());


app.use('/', postRoute);

PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(chalk.redBright(`server running at ${PORT}`));
});