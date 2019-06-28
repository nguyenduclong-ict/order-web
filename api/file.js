/**
 * Create by Long Nguyễn
 * Lấy file từ trong thư mục upload của server
 */

const express = require("express");
var router = express.Router();
var File = require("../models/File");
const NError = require("../helpers/Error");
const rootPath = process.env.ROOT_PATH;
const path = require("path");
const jimp = require("jimp");
// Router
router.get("/", getFile);
router.delete("/delete", deleteFile);
// router.put('/updates',updateFiles);
// Xoá ảnh
async function deleteFile(req, res) {
  let filename = req.query.filename;
  if (!req.user) return res.status(403).json({ message: "Forbidden" });
  let owner = req.user.type == "admin" ? undefined : req.user._id;
  File.methods.removeFile(filename, owner).then(result => {
    if (result) {
      return res.json({ result: true, message: "Xoá file thành công!" });
    } else {
      return res.status(500).json({ message: "Lỗi" });
    }
  });
}

/**
 * code = req.query.code getImage
 * filename = req.query.filename
 *
 */
async function getFile(req, res) {
  let user = req.user;
  let file = req.data.file;
  console.log("file ", file);
  try {
    if (!file.isPublic && !user._id.equals(file.owner))
      throw new NError("Khong co quyen truy cap file", 403);
    let filePath = path.join(rootPath, file.path, file.filename);
    if (req.query.size) {
      let size = req.query.size.split("x");
      let w = Number(size[0]);
      let h = Number(size[1]);
      jimp
        .read(filePath)
        .then(image => {
          if (req.query.size) {
            let left = (image.getWidth() - w) / 2;
            let top = (image.getHeight() - h) / 2;
            image
              .resize(jimp.AUTO, h)
              .crop(left, top, w, h)
              .getBuffer(jimp.MIME_JPEG, (err, buffer) => {
                res.set("Content-Type", jimp.MIME_JPEG);
                res.send(buffer);
              });
          }
        })
        .catch(err => {
          console.log("get File Error " + err);
          return res.sendFile(path.join(rootPath, "public/img/no-image.png"));
        });
    } else {
      return res.sendFile(filePath);
    }
  } catch (error) {
    return res.status(error.code).send(error.message);
  }
}

module.exports = router;
