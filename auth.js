const { sign, verify } = require("jsonwebtoken")
const ACCESS_TOKEN_SECRET = 'snowmangotthemoves1338'

const createAccessToken = (username) => {
  return sign({ username }, ACCESS_TOKEN_SECRET);
};

// Express middleware
const isAuthorized = (req, res, next) => {
  const authorization = req.header('authorization')

  if (!authorization) {
    return res.status(401).end();
  }

  try {
    const token = authorization.split(" ")[1]
    const { username } = verify(token, ACCESS_TOKEN_SECRET)
    req.user = { username: username.toLowerCase() }
  } catch (err) {
    return res.status(401).json({ message: 'access token expired or invalid' });
  }

  return next();
};

module.exports = {
  isAuthorized,
  createAccessToken
}