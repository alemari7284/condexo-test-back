const express = require('express')
const cors = require('cors')
const app = express()
const moment = require('moment')

const mongoose = require('mongoose')
mongoose
  .connect('mongodb://localhost/condexo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB...'))
  .catch((err) => console.error('Could not connect to MongoDB', err))

const userSchema = new mongoose.Schema({
  _id: Number,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  dateofbirth: String,
  hometown: String,
  taxcode: String,
  job: String,
  statocivile: String,
  residenza: String,
})

const User = mongoose.model('User', userSchema)
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('hello world!')
})

app.post('/signup', async (req, res) => {
  const len = await User.find().count()
  const {
    firstName,
    lastName,
    email,
    password,
    dateofbirth,
    hometown,
    statocivile,
    taxcode,
    job,
    residenza,
  } = req.body

  const newUser = new User({
    _id: len,
    firstName,
    lastName,
    email,
    password,
    dateofbirth,
    hometown,
    statocivile,
    taxcode,
    job,
    residenza,
  })
  const result = await newUser.save()
  console.log(result)

  return res.status(200).send({ message: 'user successfully logged' })
})

app.post('/search', async (req, res) => {
  const searchName = req.body.searchLastName
  let users
  try {
    searchName
      ? (users = await User.find({ lastName: searchName }).select(
          'firstName lastName email dateofbirth hometown statocivile taxcode job residenza',
        ))
      : (users = await User.find())
    return res.status(200).send(users)
  } catch (error) {
    return res.send(error)
  }
})

app.put('/update', async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    dateofbirth,
    hometown,
    statocivile,
    taxcode,
    job,
    residenza,
  } = req.body

  try {
    const result = await User.updateOne(
      { _id: req.body['_id'] },
      {
        firstName,
        lastName,
        email,
        dateofbirth,
        hometown,
        statocivile,
        taxcode,
        job,
        residenza,
      },
    )
    return res.status(200).send(result)
  } catch (error) {
    console.log(error.message)
  }
})

app.listen(3001, () => {
  console.log('server started on port 3001')
  console.log(moment(Date.now()).format('D-MM-YYYY'))
})
