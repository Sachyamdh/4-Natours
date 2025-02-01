import mongoose, { Query } from "mongoose";
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "A user must have an email"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    minlength: [8, "Password msut be 8 characters long"],
    select: false,
    trim: true,
    required: [true, "Password is required"],
  },
  confirm_password: {
    type: String,
    required: [true, "Please confirm your password"],
    minlength: [8, "Password msut be 8 characters long"],
    validate: {
      validator: function (this: any, val: string): boolean {
        return val === (this as any).password;
      },
      message: "Passwords are not the same",
    },
  },
  role: {
    type: String,
    enum: {
      values: ["user", "guide", "lead-guide", "admin"],
      message: "User can be one of these: user, guide, lead-guide and admin",
    },
    default: "user",
    set: function (value: string) {
      if (value) {
        return value;
      } else {
        return "user";
      }
    },
  },
  photo: {
    type: String,
  },
  password_changed_at: Date,
  password_reset_token: String,
  password_reset_expires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

//hasing the password before saving it
userSchema.pre("save", async function (next) {
  const [hashedPassword, confirmhashedPassword] = await Promise.all([
    bcrypt.hash(this.password, 10),
    bcrypt.hash(this.confirm_password, 10),
  ]);
  this.password = hashedPassword;
  this.confirm_password = confirmhashedPassword;
  next();
});

//method to check the correct password
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return (await bcrypt.compare(candidatePassword, userPassword)) as boolean;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
