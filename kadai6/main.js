const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const auth = require('./controller/auth')
const login = require('./controller/login')
const download = require('./controller/download')
const DynamoDBStore = require('connect-dynamodb')({ session: session })

const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', session({
  name: 'login.session',
  secret: 'login.session2',
  resave: false,
  saveUninitialized: true,
  cookie: {
    path: '/',
    secure: false
  },
  store: new DynamoDBStore({
    table: 'session-table'
  })
}))

app.set('view engine', 'ejs')

app.get('/', auth, (req, res) => {
  const user = req.session.user
  res.render('top.ejs', { name: user.name })
})

app.post('/login', login)

app.get('/download', download)

app.listen(3000, (err) => {
  if (err) throw err
  console.log('Server is started')
})