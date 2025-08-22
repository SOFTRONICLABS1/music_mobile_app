const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const crypto = require('crypto');

const axios = require('axios');

const app = express();
const port = 4000;
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const jwt = require('jsonwebtoken');

mongoose
  .connect('mongodb+srv://sujan:sujan@cluster0.fxg0g.mongodb.net/')
  .then(() => {
    console.log('Connected to Mongo Db');
  })
  .catch(err => {
    console.log('Error connecting to MongoDb', err);
  });

app.listen(port, () => {
  console.log('Server running on port 4000');
});

const User = require('./models/user');

const JWT_SECRET = crypto.randomBytes(64).toString('hex');

app.post('/google-login', async (req, res) => {
  const {idToken} = req.body;

  try {
    // Verify the ID token with Google API
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`,
    );

    const {sub, email, name, given_name, family_name, picture} = response.data;

    // Check if user already exists
    let user = await User.findOne({googleId: sub});
    if (!user) {
      // Create new user if not found
      console.log("heyyy");
      user = new User({
        googleId: sub,
        email,
        name,
        familyName: family_name,
        givenName: given_name,
        photo: picture,
      });
      await user.save();
    }

    // Create JWT token for authentication
    const token = jwt.sign({userId: user._id, email: user.email}, JWT_SECRET, {
      expiresIn: '1h',
    });

    // Send response with the user and token
    res.status(200).json({
      message: 'Google login successful',
      user,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({message: 'Google authentication failed', error});
  }
});

app.get('/user/:userId', async (req, res) => {
  try {
    const {userId} = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(200).json({message: 'User not found'});
    }

    return res.status(200).json({user});
  } catch (error) {
    console.log('Error', error);
    res.status(500).json({message: 'failed to fetch user'});
  }
});
