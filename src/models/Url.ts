const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  firstContentfulPaint: {
    type: String,
  },
  timeToInteractive: {
    type: String,
  },
  speedIndex: {
    type: String,
  },
  totalBlockingTime: {
    type: String,
  },
  largestContentfulPaint: {
    type: String,
  },
  cumulativeLayoutShift: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  domain: {
    type: mongoose.Schema.ObjectId,
    ref: "Domain",
    required: true,
  }
});

const Url = mongoose.model("URL", UrlSchema);
export default Url;
