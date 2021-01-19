import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("selectedFile");

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPost = async (req, res) => {
  console.log(req.body);
  upload(req, res, function (err) {
    console.log(req);
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    // const newPost = new PostMessage({
    //   title: req.body.title,
    //   message: req.body.message,
    //   creator: req.body.creator,
    //   tags: req.body.tags,
    //   selectedFile: req.files.selectedFile,
    // });

    // newPost
    //   .save()
    //   .then(() => res.json(newPost))
    //   .catch((error) => res.status(400).json({ message: error }));

    //   // const newPost = new PostMessage({
    //   //   ...req.body,
    //   //   selectedFile: req.file.file,
    //   // });
    //   // newPost
    //   //   .save()
    //   //   .then(() => res.json(newPost))
    //   //   .catch((error) => res.status(400).json({ message: error }));
  });
  console.log(req.files.selectedFile);
  // const post = req.body;
  // console.log(post);
  // const newPost = new PostMessage(post);
  // try {
  //   await newPost.save();
  //   res.status(201).json(newPost);
  // } catch (error) {
  //   res.status(409).json({ message: error.message });
  // }
};

export const deletePost = async (req, res) => {
  const { id } = req.params;
  try {
    await PostMessage.findByIdAndRemove(id);
    const postMessages = await PostMessage.find();
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editPost = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  await PostMessage.findByIdAndUpdate(id, req.body);
  const posts = await PostMessage.find();
  res.json(posts);
};

export const like = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send(`No post with id: ${id}`);
  const post = await PostMessage.findById(id);
  post.likeCount++;
  await post.save();
  const posts = await PostMessage.find();
  res.json(posts);
};
