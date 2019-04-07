const express = require('express');
var router = express.Router();
var File = require('../models/File');
const NError = require('../helpers/Error');
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
        console.log(user);
        console.log(file);
        if (!file.isPublic && !user._id.equals(file.owner)) {
            throw new NError("Khong co quyen truy cap file", 403);
        } else {
            return res.sendFile(file.path);
        }
    } catch (error) {
        return res.status(error.code).send(error.message);
    }

}

module.exports = router;