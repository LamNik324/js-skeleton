import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  body: String,
  user: String,
  createdAt: Date,
  updatedAt: Date,
});

PostSchema.statics.mostRecent = async function () {
  return this.find().sort({createdAt: -1}).exec();
}

export default mongoose.model('Post', PostSchema);
