const {Schema, model} = require("mongoose")

const userSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"],
    minlength: [4, "minimum length is 4 characters"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "email id is required"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone email!`,
    },
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: [8, "mimimum length of the password should be 8"],
  },

  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: [true, "phone number is required"],
    minlength: [8, "mimimum length of the password should be 8"],
  },

  is_admin: {
    type: Number,
    default: 0,
  },
  is_verified: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  image: {
    data: Buffer,
    contentType: String
  }
});

const User = model("usersmodel", userSchema);

module.exports = User;

