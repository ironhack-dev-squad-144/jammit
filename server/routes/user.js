const express = require('express')
const User = require('../models/User')
const { isLoggedIn, defineData } = require('../middlewares')
const uploadCloud = require('../configs/cloudinary.js')
const router = express.Router()

/* This route returns the info about the logged user*/
router.get('/', isLoggedIn, (req, res, next) => {
  let userId = req.user._id
  User.findById(userId)
    .then(user => res.json(user))
    .catch(err => next(err))
})

/* This route allows editing user profile*/
router.put(
  '/',
  isLoggedIn,
  defineData(['bio', 'links', 'jamSpot', 'gear', 'skills']),
  uploadCloud.single('file'),
  (req, res, next) => {
    let userId = req.user._id

    if (req.file) {
      req.data['profilePic'] = req.file.secure_url
    }

    User.findByIdAndUpdate(userId, req.data, { new: true })
      .then(user => res.json(user))
      .catch(err => next(err))
  }
)

module.exports = router
