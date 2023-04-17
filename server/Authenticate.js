const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken')

const app = express();
app.use(express.json());
app.use(cors());

const uDB = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'spldatabase'
})

const Authenticate = async (req, res, next) => {
  try {
    
    const token = req.cookie.jwt
  } catch (error) {
    res.status(401).send(error)
  }
}

export default Authenticate