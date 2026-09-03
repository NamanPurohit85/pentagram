import commentModel from "../models/commentModel.js";
import blogModel from "../models/blogModel.js";
import { io } from "../config/socket.js";

const createCommentController = async (req, res) => {
  try {
    const { description } = req.body;
    const blogId = req.params.blogId;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const authorId = req.userId;

    const newComment = await commentModel.create({
      author: authorId,
      blogId: blogId,
      description,
    });

    // Optionally increment commentCount in blogModel
    const updatedBlog = await blogModel.findByIdAndUpdate(blogId, { $inc: { commentCount: 1 } }, { new: true });

    // Populate author for socket broadcast
    const populatedComment = await commentModel.findById(newComment._id).populate("author", "name profilePic");
    io.emit("newComment", { blogId, comment: populatedComment, commentCount: updatedBlog.commentCount });

    res.status(201).json({
      success: true,
      message: "Comment created successfully!",
      comment: newComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create comment",
      error: error.message,
    });
  }
};

const getCommentsController = async (req, res) => {
  try {
    const blogId = req.params.blogId;
    
    if (!blogId) {
      return res.status(400).json({ message: "Blog ID is required" });
    }

    const comments = await commentModel
      .find({ blogId })
      .populate("author", "name profilePic")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, comments });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot find comments", error: error.message });
  }
};

const deleteCommentController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Enter ID for delete" });
    }

    const comment = await commentModel.findOneAndDelete({
      _id: id,
      author: req.userId,
    });

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found or you are not authorized to delete it.",
      });
    }

    // Decrement comment count
    await blogModel.findByIdAndUpdate(comment.blogId, { $inc: { commentCount: -1 } });

    return res.status(200).json({ success: true, message: "Deleted successfully", comment });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot delete", error: error.message });
  }
};

export { createCommentController, getCommentsController, deleteCommentController };
