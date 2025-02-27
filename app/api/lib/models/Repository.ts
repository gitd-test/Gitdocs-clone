import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    repositoryId: { type: String, required: true, unique: true },
    description: { type: String },
    gitLink: { type: String, required: true },
    owner: { type: String, ref: 'User', required: true },
    readme: { type: String, ref: 'Readme', required: false },
    lastUpdated: { type: Date, default: Date.now },
    status: { type: String, enum: ['fine', 'info', 'needs-attention'], default: 'fine' },
    recentCommitDescription: { type: String },
    suggestions: { type: Number, default: 0 },
    visibility: { type: String, enum: ['public', 'private'], default: 'public' },
    starred: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
});

const Repository = mongoose.models.Repository || mongoose.model('Repository', repositorySchema);

export default Repository;
