const express = require('express');
var router = express.Router();
var File = require('../models/File');
const imagePath = process.env.IMAGE_PATH;
router.get('/image/', getImage);

async function getImage(req, res) {
    let user = req.user;
    let filename = req.query.filename;
    try {
        let file = await File.findOne({
            filename : filename,
            type : "image"
        });
        if(!file) {
            let error = new Error("File not exist");
            error.code = 404;
            throw error;
        }
        if (!file.isPublic) {
            if(file.owner != user._id) {
                let error = new Error("Khong co quyen truy cap file");
                error.code = 403;
                throw error;
            }
        } else {
            return res.sendFile(imagePath + '/' + filename);
        }
    } catch (error) {
        return res.status(error.code).send(error.message);
    }

}

module.exports = router;