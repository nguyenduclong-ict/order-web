
/**
 * Create by Long Nguyễn 
 * Lấy file từ trong thư mục upload của server
 */

const express = require('express');
var router = express.Router();
var File = require('../models/File');
const NError = require('../helpers/Error');
const rootPath = process.env.ROOT_PATH;
const path = require('path');

router.get('/file/', getFile);
router.post('/file/delete/', postDeleteFile);

// Xoá ảnh
async function postDeleteFile(req, res) {
    let filename = req.query.filename;
    if (!req.user) return res.status(403).json({message : 'Forbidden'});
    let owner = req.user.type == 'admin' ? undefined : req.user._id;
    File.methods.removeFile(filename,owner)
        .then(result => {
            if(result) {
                return res.json({result : true, message : 'Xoá file thành công!'});
            } else {
                return res.status(500).json({message : 'Lỗi'});
            }
        });
};


/**
 * code = req.query.code getImage
 * filename = req.query.filename
 * 
 */
async function getFile(req, res) {
    let user = req.user;
    let file = req.data.file;
    try {
        if (!file)
            throw new NError("File not exist", 403);
        else if (!file.isPublic && !user._id.equals(file.owner))
            throw new NError("Khong co quyen truy cap file", 403);
        else {
            return res.sendFile(path.join(rootPath, file.path, filename));
        }

    } catch (error) {
        return res.status(error.code).send(error.message);
    }

}

module.exports = router;