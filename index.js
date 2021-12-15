const https = require("https")
const fs = require("fs")
const bodyparser = require("body-parser")
const express = require("express")

const { isAuthorized, createAccessToken } = require("./auth")

// Https certificates
const options = {
  key: fs.readFileSync("keys/server.key"),
  cert: fs.readFileSync("keys/server.cert")
};


// Very simple key/value storage
// Ofc not a good practice, but sufficient for the sake of this exercise
STORE = {
  // Namespaces
  "users": {
    "user1": "password1",
    "user2": "password2",
    "user3": "password3"
  },
  "userdata": {
    // Key value storage per user
    "user1": {

    },
    "user2": {

    },
    "user3": {

    }
  }
}

const app = express();

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));


/* ----------- Authentication ----------- */
app.post("/authenticate", (req, res) => {
  const { username, password } = req.body;

  if (username && STORE.users[username] == password) {
    return res.send({
      ok: true,
      token: createAccessToken(username)
    })
  }

  return res.status(401).send({
    ok: false,
    message: 'username or password wrong'
  })
})

/* ----------- List ----------- */
app.get("/", isAuthorized, (req, res) => {
  const { username } = req.user
  
  try {
    const keys = Object.entries(STORE.userdata[username]).map(([key, _value]) => key)
    res.send({ ok: true, keys })
  } catch (e) {
    res.send({ ok: false })
  }
})

/* ----------- Get ----------- */
app.get("/:key", isAuthorized, (req, res) => {
  const { username } = req.user
  const { key } = req.params

  try {
    const value = STORE.userdata[username][key]

    if (!value) {
      return res.status(404).send({ ok: false })
    }
    res.send({ ok: true, value })
  } catch(e) {
    res.status(404).send({ ok: false })
  }
})

/* ----------- Delete ----------- */
app.delete("/:key", isAuthorized, (req, res) => {
  const { username } = req.user
  const { key } = req.params

  try {
    delete STORE.userdata[username][key]
  } catch (e) {
    return res.send({ ok: false })
  }
  res.send({ ok: true })
})

/* ----------- Put ----------- */
app.put("/", isAuthorized, (req, res) => {
  const { username } = req.user
  const { key, value } = req.body

  try {
    STORE.userdata[username][key] = value
  } catch (e) {
    return res.send({ ok: false })
  }
  res.send({ ok: true })
})


https.createServer(options, app).listen(8080, '0.0.0.0');