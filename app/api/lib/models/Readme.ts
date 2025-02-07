import mongoose from "mongoose";

const readmeSchema = new mongoose.Schema({
    repository: { type: mongoose.Schema.Types.ObjectId, ref: 'Repository' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });

  
  const Readme = mongoose.models.Readme || mongoose.model('Readme', readmeSchema);

  export default Readme;
  