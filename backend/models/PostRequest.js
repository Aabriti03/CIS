const mongoose = require('mongoose');

const postRequestSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    workerId: {  // New field to track assigned worker or direct requests
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    category: {
      type: String,
      required: true,
      enum: ['electrician', 'babysitting', 'gardening', 'househelp', 'plumbing'],
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      enum: ['pending', 'accepted', 'rejected'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PostRequest', postRequestSchema);
