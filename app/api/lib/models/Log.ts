import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' },
    timestamp: { type: Date, default: Date.now },
  });

  
  const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

  export default Log;
  