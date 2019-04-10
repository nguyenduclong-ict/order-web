
/**
 * Create by Long Nguyễn 
 * Lấy file từ trong thư mục upload của server
 */

const express = require('express');
var router = express.Router();
var File = require('../models/File');
const NError = require('../helpers/Error');
const imageDirectory = process.env.IMAGE_ROOT_PATH;
const path = require('path');
const fs = require('fs');

router.get('/image/', getImage);
router.post('/image/delete/', postDeleteImage);

// 
async function postDeleteImage(req, res) {
    let filename = req.query.filename;
    let directory = imageDirectory;
    let filepath = path.join(directory, filename);
    if (!req.user) return res.status(500).send('Error');
    File.deleteOne({
            owner: req.user._id,
            filename: filename
        })
        .then(async result => {
            if (result.deletedCount == 0) throw new Error('File not found');
            fs.unlink(filepath, (err) => {
                if (!err) return res.status(200).send('Xoa file thanh cong');
                else throw new Error('Unlink Error');
            });

        })
        .catch(error => {
            console.log(error);
            return res.status(500).send('Lỗi xảy ra, xoá file thất bại');
        })
};


/**
 * code = req.query.code getImage
 * filename = req.query.filename
 * 
 */
async function getImage(req, res) {
    let user = req.user;
    let file = req.data.file;
    try {
        if (!file)
            throw new NError("File not exist", 403);
        else if (!file.isPublic && !user._id.equals(file.owner))
            throw new NError("Khong co quyen truy cap file", 403);
        else
            return res.sendFile(file.path);

    } catch (error) {
        return res.status(error.code).send(error.message);
    }

}

module.exports = router;