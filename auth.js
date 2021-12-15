const { sign, verify } = require("jsonwebtoken")
// const serialize = require('node-serialize');
// const jwtDecode = require('jwt-decode');
const ACCESS_TOKEN_SECRET = 'snowmangotthemoves'


const sanitizeJWTPayload = input => input.replace(/[^a-zA-Z]/g, "")

const createAccessToken = (username) => {
  return sign({ username: sanitizeJWTPayload(username) }, ACCESS_TOKEN_SECRET);
};


// Express middleware
const isAuthorized = (req, res, next) => {
  const authorization = req.header('authorization')

  if (!authorization) {
    return res.status(401).end();
  }

  try {
    const token = authorization.split(" ")[1]
    // const decoded = jwtDecode(token)
    // req.user = serialize.unserialize(decoded)
    // verify(token, ACCESS_TOKEN_SECRET)
    req.user = verify(token, ACCESS_TOKEN_SECRET)
  } catch (err) {
    return res.status(401).json({ message: 'access token expired or invalid' });
  }

  return next();
};



module.exports = {
  isAuthorized,
  createAccessToken
}