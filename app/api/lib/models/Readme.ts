import mongoose from "mongoose";

const readmeSchema = new mongoose.Schema({
    repositoryId: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  });


  const Readme = mongoose.models.Readme || mongoose.model('Readme', readmeSchema);

  export default Readme;
  