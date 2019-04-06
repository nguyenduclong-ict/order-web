const express = require('express');
var router = express.Router();
var multer = require('multer')
var fs = require('fs');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
// Storage 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/images')
    },
    filename: (req, file, cb) => {
        console.log(file, Array.isArray(file));
        if (!MIME_TYPE_MAP[file.mimetype])
            return cb(Error('Dinh dang file khong ho tro'), null);
        else
            cb(null, file.fieldname + '-' + Date.now() + '.' + MIME_TYPE_MAP[file.mimetype]);
    }
});

router.get('/', getFile);

function getFile(req, res, next) {
    //if(!req.header.token) return res.status(430).send('Fobbhien');
    const path=require('path');
    const filepath = 'D:/NUCE/Nam 4/Ky 2/Đồ án tổng hợp/Order/public/uploads/images/YURqRWZdcg.jpg';
    return res.sendFile(filepath);
}
// Init upload
var upload = multer({
    storage: storage
});

// Upload single file
router.post('/image', upload.single('image'), (req, res, next) => {
    let filename = req.file.filename;
    let filepath = req.file.destination.substring(6);
    res.json({
        filename: filename,
        filepath: filepath
    });
});
// Upload multiple file

router.post('/images', upload.array('images', 10), (req, res, next) => {
    let result = []
    req.files.forEach(element => {
        let filename = element.filename;
        let filepath = element.destination.substring(6);
        result.push({
            filename: filename,
            filepath: filepath
        });
    });
    res.json(result);
});

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
            return res.json({message : "File deleted!"})
    })
});

module.exports = router;