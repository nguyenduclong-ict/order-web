const express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs');
const File = require('../models/File');
const imageRootPath = process.env.IMAGE_ROOT_PATH;
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
// Storage 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, imageRootPath)
    },
    filename: (req, file, cb) => {
        console.log(file, Array.isArray(file));
        if (!MIME_TYPE_MAP[file.mimetype])
            return cb(Error('Dinh dang file khong ho tro'), null);
        else
            cb(null, file.fieldname + '-' + Date.now() + '.' + MIME_TYPE_MAP[file.mimetype]);
    }
});

// Init upload
var upload = multer({
    storage: storage
});

// Upload single file
router.post('/image', upload.single('image'), uploadSingleImage);

async function uploadSingleImage(req, res, next) {
    let filename = req.file.filename;
    let filepath = path.join(imageRootPath , filename);
    console.log(filepath);
    console.log(req.body);
    let obj = {
        owner: req.body.owner,
        filename: filename,
        path: filepath,
        type: 'image',
        isPublic: req.body.isPublic
    }

    let file = new File(obj);
    try {
        let result = await file.save();
        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).send('Upload thất bại');
    }
};
// Upload multiple file

router.post('/images', upload.array('images', 10), uploadMultipleImage);
async function uploadMultipleImage(req, res, next) {
    let result = []
    try {
        req.files.forEach(async element => {
            let filename = element.filename;
            let filepath = imageRootPath + '/' + filename;
            let obj = {
                owner: req.body.owner,
                filename: filename,
                path: filepath,
                type: 'image',
                public: req.body.isPublic
            }

            let file = new File(obj);
            let rs = await file.save();
            result.push(rs);
        });
    } catch (error) {
        res.status(500).send('Upload that bai');
    }
    res.json(result);
    
};

router.post('/image/delete/:filename', (req, res, next) => {
    let filename = req.params.filename;
    let directory = 'public/uploads/images/';
    fs.unlink(directory + filename, (err) => {
        if (err) {
            console.log(err);
            return res.json({
                error: true,
                message: err.message
            });
        } else
            return res.json({
                message: "File deleted!"
            })
    })
});

module.exports = router;