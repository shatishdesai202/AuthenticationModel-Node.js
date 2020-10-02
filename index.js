const express = require('express');
const app = express();

const dotenv = require('dotenv');

// load config
dotenv.config({ path: './Env/config.env' });

const mongoose = require('mongoose');

// color console
const chalk = require('chalk');

const cors = require('cors');


mongoose.connect('mongodb://localhost:27017/One', {useNewUrlParser: true, useUnifiedTopology: true}, ()=>{
    console.log(chalk.blueBright('DATABASE CONNECTED'));
});

app.use(express.json());
app.use(cors());


PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(chalk.redBright(`server running at ${PORT}`));
});