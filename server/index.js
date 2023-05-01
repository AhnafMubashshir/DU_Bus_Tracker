const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const AuthService = require('./AuthService')
const mongoose = require('mongoose');
const { DOUBLE } = require('sequelize')

const app = express();
app.use(express.json());
app.use(cors());

// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'webtech'
// })
// db.connect(err => {
//     if (err) {
//         return err;
//     }
// })

mongoose.connect('mongodb://localhost:27017/my_projects/du_bis_tracker', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))

const UserSchema = new mongoose.Schema({
    name: String,
    bus_name: String,
    bus_code: String,
    email: String,
    password: String,
    loggedIn: Boolean,
    latitude: DOUBLE,
    longitude: DOUBLE
});

const User = mongoose.model('User', UserSchema);


app.post('/submitData', (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const bus_name = req.body.bus_name;
    const bus_code = req.body.bus_code;
    const email = req.body.email;
    const password = req.body.password;
    const loggedIn = 'False'

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    if (isMatch) {
        // db.query("INSERT into userdb(name, bus_name, bus_code, email, password, loggedIn) values(?,?,?,?,?,?)",
        //     [name, bus_name, bus_code, email, hashedPassword, loggedIn], (err, result) => {
        //         if (err) {
        //             console.log(err);
        //         } else {
        //             res.send(result);
        //         }
        //     });

        const user = new User({
            name,
            bus_name,
            bus_code,
            email,
            password: hashedPassword,
            loggedIn,
            latitude: 0.0,
            longitude: 0.0
        });

        user.save((err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        });
    } else {
        res.status(400).send('Passwords do not match');
    }

})

app.post('/verifyUser', (req, res) => {
    // console.log(req);

    const email = req.body.email;
    const password = req.body.password;
    const loginSign = req.body.loginSign;
    const sign = false;

    // console.log('====================================');
    // console.log(loginSign);
    // console.log('====================================');

    db.query("SELECT * FROM userdb where email=?", [email], (err, result) => {
        // console.log(result[0].password);
        const isMatch = bcrypt.compareSync(password, result[0].password);
        if (isMatch) {
            if (result[0].loggedIn == 'False') {
                const hashedPassword = result[0].password
                const isMatched = bcrypt.compareSync(password, hashedPassword);

                const secretKey = crypto.randomBytes(64).toString('hex');
                AuthService.setSecretKey(secretKey)

                const encryptionKey = crypto.createHash('sha256').update(result[0].email).digest();
                const iv = Buffer.alloc(16, 0);

                const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);

                let encryptedSecretKey = cipher.update(secretKey, 'utf8', 'hex');
                encryptedSecretKey += cipher.final('hex');

                const payload = { email: result[0].email }

                const token = jwt.sign(payload, encryptedSecretKey);

                if (isMatched) {
                    db.query("UPDATE userdb SET loggedIn = ? WHERE email = ?", [loginSign, email], (err, result) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send({ sign: true, token });
                        }
                    })
                }
                else {
                    res.send(sign)
                }
            }
            else {
                res.send({ canLogIn: "False" });
            }
        }
    })
})


app.post('/updateLoginSign', (req, res) => {
    const email = req.body.email;
    const loginSign = req.body.loginSign;

    // console.log('====================================');
    // console.log(email);
    // console.log('====================================');

    db.query("UPDATE userdb SET loggedIn = ? WHERE email = ?", [loginSign, email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})


app.post('/savePosition', (req, res) => {
    const email = req.body.email;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    // console.log('====================================');
    // console.log(email);
    // console.log('====================================');

    db.query("UPDATE userdb SET latitude = ?, longitude = ? WHERE email = ?", [latitude, longitude, email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })
})

app.post('/getPositions', (req, res) => {

    db.query("select bus_name, bus_code, latitude, longitude from userdb", (err, result) => {
        if (err) {
            console.log(err);
        } else {
            // console.log('====================================');
            // console.log(result);
            // console.log('====================================');
            res.send(result);
        }
    })
})

app.post('/checkValidation', (req, res) => {
    var token = req.body.token;
    const email = req.body.email;
    if (token === null) {
        token = 'qwer';
    }

    try {
        const sign = AuthService.isAuthenticated(token, email);
        console.log('sent');
        res.send(sign);
    } catch (err) {
        console.error("wont be sent");
        res.status(500).send('Internal server error');
    }
})

app.post('/delete', (req, res) => {
    const email = req.body.email;

    db.query("DELETE from userdb where email= ?", [email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })

})

app.post('/getUserInfo', (req, res) => {
    const email = req.body.email;

    db.query("select * from userdb where email= ?", [email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.send(result);
        }
    })

})


app.listen(5050, () => {
    console.log("Server listening on port 5050.");
})