const { string } = require("joi");
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "please provide a company name"],
      maxlength: 50,
    },
    position: {
      type: String,
      required: [true, "please provide a position"],
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "declined", "interview"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Jobs", jobSchema);
