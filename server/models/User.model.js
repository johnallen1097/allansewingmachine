const crypto = require('crypto')
const mongoose = require('mongoose')
const bcyrpt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email already exist'],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Valid email is required',
      ],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    address: {
      unit: {
        type: String,
        default: '',
      },
      street: {
        type: String,
        default: '',
      },
      city: {
        type: String,
        default: '',
      },
      state: {
        type: String,
        default: '',
      },
      country: {
        type: String,
        default: '',
      },
      zipcode: {
        type: String,
        default: '',
      },
    },
    contact: {
      type: String,
      default: '',
    },

    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: [6, 'Password minimum length is 6'],
      select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  //virtual
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  { timestamps: true }
)

//Encypt password
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcyrpt.genSalt(10)
  this.password = await bcyrpt.hash(this.password, salt)
})

UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('Email already taken.'))
  } else {
    next()
  }
})

// Cascade delete order when a user is deleted
UserSchema.pre('remove', async function (next) {
  console.log(`Order being removed from user ${this._id}`)
  await this.model('Order').deleteMany({ user: this._id })
  next()
})

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcyrpt.compare(enteredPassword, this.password)
}

UserSchema.methods.getResetPasswordToken = function () {
  //generate token
  const resetToken = crypto.randomBytes(20).toString('hex')
  //hast token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  //set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}

// Reverse populate with virtual
UserSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
  justOne: false,
})

module.exports = mongoose.model('User', UserSchema)
