import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    blogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "blog",
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 200,
    },
  },
  { timestamps: true },
);

const commentModel = mongoose.model("comment", commentSchema);
export default commentModel;
