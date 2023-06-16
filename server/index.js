const express = require('express')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const AuthService = require('./AuthService')

const app = express();
app.use(express.json());
app.use(cors());

const db = require('./models');
const { Users } = require('./models');


app.post('/submitData', async (req, res) => {
    console.log(req.body);

    const name = req.body.name;
    const bus_name = req.body.bus_name;
    const bus_code = req.body.bus_code;
    const email = req.body.email;
    const password = req.body.password;
    const loggedIn = false;

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const isMatch = bcrypt.compareSync(password, hashedPassword);

    const oldUser = await Users.findOne({
        where: {
            email: email
        }
    })

    console.log(hashedPassword);

    if (isMatch && !oldUser) {
        const user = {
            name,
            bus_name,
            bus_code,
            email,
            password: hashedPassword,
            loggedIn,
            latitude: 0.0,
            longitude: 0.0
        };

        await Users.create(user);

        res.send({ message: 'Success' });
    } else {
        res.status(400).send('An error occured');
    }

})

app.post('/verifyUser', async (req, res) => {
    // console.log(req);

    const email = req.body.email;
    const password = req.body.password;
    const loginSign = req.body.loginSign;
    const sign = false;
    var isMatch = false;

    const user = await Users.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        res.send({ message: 'User does not exists.' });
    }
    else {
        isMatch = bcrypt.compareSync(password, user.password);

        if (isMatch) {
            if (user.loggedIn == false) {
                const hashedPassword = user.password;
                const isMatched = bcrypt.compareSync(password, hashedPassword);
                console.log(isMatched);

                const secretKey = crypto.randomBytes(64).toString('hex');
                console.log(isMatched);
                AuthService.setSecretKey(secretKey)
                console.log(isMatched);

                const encryptionKey = crypto.createHash('sha256').update(user.email).digest();
                console.log(isMatched);
                const iv = Buffer.alloc(16, 0);
                console.log(isMatched);

                const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, iv);
                console.log(isMatched);

                let encryptedSecretKey = cipher.update(secretKey, 'utf8', 'hex');
                console.log(isMatched);
                encryptedSecretKey += cipher.final('hex');
                console.log(isMatched);

                const payload = { email: user.email }
                console.log(isMatched);

                const token = jwt.sign(payload, encryptedSecretKey);

                console.log(isMatched);

                if (isMatched) {
                    user.loggedIn = loginSign;

                    await user.save();

                    res.send({ sign: true, token });
                }
                else {
                    res.send(sign)
                }
            }
            else {
                res.send({ canLogIn: "False" });
            }
        }
    }

})


app.post('/updateLoginSign', async (req, res) => {
    const email = req.body.email;
    const loginSign = req.body.loginSign;

    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    user.loggedIn = loginSign;

    await user.save();

    res.send({ message: 'Success' });
})


app.post('/savePosition', async (req, res) => {
    const email = req.body.email;
    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    user.latitude = latitude;
    user.longitude = longitude;

    await user.save();

    res.send({ message: 'Success' });
})

app.post('/getPositions', async (req, res) => {

    const users = await Users.findAll({
        attributes: ['bus_name', 'bus_code', 'latitude', 'longitude']
    })

    res.send(users);
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

app.post('/delete', async (req, res) => {
    const email = req.body.email;

    const user = await Users.findOne({
        where: {
            email: email
        }
    });

    await user.destroy();

    res.json({ message: 'User info deleted.' });

})

app.post('/getUserInfo', async (req, res) => {
    const email = req.body.email;

    const user = await Users.findOne({
        where: {
            email: email
        }
    })

    res.send(user);

})


db.sequelize.sync().then(() => {
    app.listen(5050, () => {
        console.log("Server listening on port 5050.");
    })
})