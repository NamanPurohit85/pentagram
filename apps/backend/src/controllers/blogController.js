import blogModel from "../models/blogModel.js";
import { createBlogSchema, updateBlogSchema } from "./blogValidate.js";

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
    const authorId = req.userId;
    const newBlog = await blogModel.create({
      author: authorId,
      title,
      description,
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
    const id = req.userId;
    const allBlog = await blogModel.find({ author: id });
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

export { createBlogController, getAllBlogController, updateBlogController, deleteBlogController };
