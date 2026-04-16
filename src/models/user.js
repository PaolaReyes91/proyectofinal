import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  hashPassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "customer", "guest"],
    default: "customer" // Es buena práctica tener un default
  },
  avatar: {
    type: String,
    required: true,
    default: "https://placehold.co/100x100.png",
  },
  phone: {
    type: String,
    max: 10,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  refreshToken: {
    type: String,
    default: null,
  }, 
  loginDate: {
    type: Date,
    default: Date.now 
  }
}, { 
  timestamps: true // Esto debe ir en el segundo objeto de configuración
});

const User = mongoose.model("User", userSchema);

export default User;
