import mongoose, { Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const Data = process.env.Data_URL;

mongoose.connect(Data).then(() => {
  console.log("======= Connected ========");
}).catch((e) => {
  console.log("======= Connection failed ========", e);
});

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [3, "Name must be at least 3 characters"],
    maxlength: [50, "Name can not exceed 50 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true, // optional: ensures no duplicate emails
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
  },
  phoneNo: {
    type: Number,
    required: [true, "Phone number is required"],
    // validate: {
    //   validator: function (v) {
    //     return /^[0-9]{10,15}$/.test(v.toString()); // only digits, length 10–15
    //   },
    //   message: props => `${props.value} is not a valid phone number`
    // }
  },
  isVerifired: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"],
    maxlength: [128, "Password can not exceed 128 characters"]
  }
});

const User = mongoose.model("User", userSchema);
export default User;
