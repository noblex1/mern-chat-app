// Import mongoose
import mongoose from "mongoose";

// Define the structure for user data
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150/4A90E2/FFFFFF?text=User'
  },
  isOnline: {
    type: Boolean,
    default: false
  },

  // ✅ Correct placement of location
  location: {
    country: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    houseAddress: {
      type: String,
      default: ''
    }
  },

  // ✅ Relationship status
  relationshipStatus: {
    type: String,
    enum: ['single', 'in a relationship', 'married', 'complicated', 'prefer not to say'],
    default: 'single'
  },

  // ✅ Date of birth
  dateOfBirth: {
    type: Date,
  }

}, {
  timestamps: true
});

// Create and export the User model
const userModel = mongoose.model('User', userSchema);
export default userModel;
