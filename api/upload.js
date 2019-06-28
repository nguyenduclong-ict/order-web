const express = require("express");
var router = express.Router();
var multer = require("multer");
const File = require("../models/File");
const path = require("path");
const uploadPath = process.env.UPLOAD_PATH;
const validator = require("../helpers/Validator");

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
// Storage
var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    console.log("router /upload Line 20", file, Array.isArray(file));
    if (!MIME_TYPE_MAP[file.mimetype])
      return cb(Error("Định dạng file không được hỗ trợ"), null);
    else {
      let r = Math.random()
        .toString(36)
        .substring(2);
      cb(
        null,
        file.fieldname +
          "-" +
          Date.now() +
          r +
          "." +
          MIME_TYPE_MAP[file.mimetype]
      );
    }
  }
});

// Init upload
var upload = multer({
  storage: storage
});

/* Router */
// Upload single file
router.post("/file", upload.single("file"), uploadFile);
// Upload multiple file
router.post("/files", upload.array("files", 10), uploadFiles);
router.post("/update-multiple", updateMultipleFile);

async function uploadFile(req, res) {
  try {
    let filename = req.file.filename;
    let filepath = uploadPath;
    let filetype = req.file.mimetype.split("/")[0];

    req.body.subOwner = req.body.subOwner ? JSON.parse(req.body.subOwner) : [];
    req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    let obj = {
      owner: req.user._id,
      subOwner: req.body.subOwner,
      filename: filename,
      path: filepath,
      type: filetype,
      isPublic: req.body.isPublic || true,
      tags: req.body.tags
    };

    let file = new File(obj);
    let result = await file.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send("Upload thất bại");
  }
}

// Upload multiple file
async function uploadFiles(req, res) {
console.log("upload Path " + uploadPath);

  let promise = [];
  console.log(req.files);
  console.log(req.body.subOwner, req.body.tags);
  try {
    req.body.subOwner = req.body.subOwner ? JSON.parse(req.body.subOwner) : [];
    req.body.tags = req.body.tags ? JSON.parse(req.body.tags) : [];
    req.files.forEach(async (element, i) => {
      let filename = element.filename;
      let filepath = uploadPath;
      let filetype = element.mimetype.split("/")[0];
      let obj = {
        owner: req.user._id,
        subOwner: req.body.subOwner,
        filename: filename,
        path: filepath,
        type: filetype,
        public: req.body.isPublic || true,
        tags: req.body.tags
      };

      let file = new File(obj);
      promise.push(file.save());
    });
    Promise.all(promise).then(result => {
      return res.json(result);
    });
  } catch (error) {
    res.status(500).send({ message: "Upload that bai", error: error.message });
  }
}

async function updateMultipleFile(req, res) {
  try {
    if (req.user.type !== "provider")
      throw new Error("Chỉ Provider mới có quyền chỉnh sửa sản phẩm", 403);
    let owner = req.user._id;
    let { tags, isPublic, subOwner, filename } = req.body;

    console.log(
      "Router file line 73",
      filename,
      owner,
      subOwner,
      isPublic,
      tags
    );
    File.methods
      .updateMultilple(filename, owner, subOwner, isPublic, tags)
      .then(result => {
        return res.json(result);
      });
  } catch (error) {
    console.log(error);
    res.status(error.code || 500).send(error.message);
  }
}
module.exports = router;
