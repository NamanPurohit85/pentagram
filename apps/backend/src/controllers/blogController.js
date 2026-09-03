import blogModel from "../models/blogModel.js";
import { createBlogSchema, updateBlogSchema } from "../validators/blogValidate.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";
import { io } from "../config/socket.js";

const createBlogController = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const { error } = createBlogSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    let imageUrl = '';
    if (req.file) {
      const uploadFromBuffer = (req) => {
        return new Promise((resolve, reject) => {
          let cld_upload_stream = cloudinary.uploader.upload_stream(
            { folder: "pentagram_blogs" },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
        });
      };
      const result = await uploadFromBuffer(req);
      imageUrl = result.secure_url;
    }

    const authorId = req.userId;
    const newBlog = await blogModel.create({
      author: authorId,
      title,
      description,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Blog created successfully!",
      blog: newBlog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

const getAllBlogController = async (req, res) => {
  try {
    const allBlog = await blogModel.find().populate('author', 'name profilePic').sort({ createdAt: -1 });
    if (!allBlog) {
      return res.status(404).json({ message: "There is no BLog" });
    }
    return res.status(200).json({ message: "All Blogs", Blog: allBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot find blog", error: error.message });
  }
};

const updateBlogController = async (req, res) => {
  try {
    const { error, value } = updateBlogSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const id = req.params.id;
    const updatedBlog = await blogModel.findOneAndUpdate(
      { _id: id, author: req.userId },
      value,
      { new: true },
    );

    if (!updatedBlog) {
      return res
        .status(404)
        .json({ message: "Blog not found or unauthorized" });
    }

    return res.status(200).json({ success: true, blog: updatedBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Update failed", error: error.message });
  }
};
const deleteBlogController = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Enter ID for delete" });
    }
    const blog = await blogModel.findOneAndDelete({
      _id: id,
      author: req.userId,
    });

    if (!blog) {
      return res.status(404).json({
        message: "Blog not found or you are not authorized to delete it.",
      });
    }

    return res.status(200).json({ message: "Deleted successfully", blog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cannot delete", error: error.message });
  }
};

const likeBlogController = async (req, res) => {
  try {
    const blogId = req.params.id;
    const userId = req.userId;

    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const hasLiked = blog.likes.includes(userId);
    if (hasLiked) {
      blog.likes = blog.likes.filter(id => id.toString() !== userId.toString());
      blog.likeCount = Math.max(0, blog.likeCount - 1);
    } else {
      blog.likes.push(userId);
      blog.likeCount += 1;
    }

    await blog.save();
    
    // Broadcast real-time update
    io.emit("postLiked", { blogId, likes: blog.likes, likeCount: blog.likeCount });
    
    return res.status(200).json({ success: true, message: hasLiked ? "Unliked" : "Liked", likeCount: blog.likeCount, likes: blog.likes });
  } catch (error) {
    return res.status(500).json({ message: "Failed to like blog", error: error.message });
  }
};

export { createBlogController, getAllBlogController, updateBlogController, deleteBlogController, likeBlogController };
