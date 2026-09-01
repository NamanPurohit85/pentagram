import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    title: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 30,
    },
    description: {
      type: String,
      required: true,
      minLength: 10,
      maxLength: 200,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const blogModel = mongoose.model("blog", blogSchema);
export default blogModel;
