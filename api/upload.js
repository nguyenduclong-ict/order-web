const express = require('express');
var router = express.Router();
var multer = require('multer');
const File = require('../models/File');
const path = require('path');
const uploadPath = process.env.UPLOAD_PATH;
const validator = require('../helpers/Validator');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}
// Storage 
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        console.log(file, Array.isArray(file));
        if (!MIME_TYPE_MAP[file.mimetype])
            return cb(Error('Định dạng file không được hỗ trợ'), null);
        else {
            let r = Math.random().toString(36).substring(2);
            cb(null, file.fieldname + '-' + Date.now() + r + '.' + MIME_TYPE_MAP[file.mimetype]);
        }
    }
});

// Init upload
var upload = multer({
    storage: storage
});

// Upload single file
router.post('/file', upload.single('file'), uploadFile);
router.post('/files', upload.array('files', 10), uploadFiles);
router.post('/update', postUpdateFile);

async function uploadFile(req, res, next) {
    let filename = req.file.filename;
    let filepath = uploadPath;
    let filetype = req.file.mimetype.split('/')[0];
    console.log(filetype);
    console.log(filepath);
    console.log(req.body);
    let obj = {
        owner: req.user._id,
        filename: filename,
        path: filepath,
        type: filetype,
        isPublic: req.body.isPublic || true,
        tags: req.body.tags ||  []
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
async function uploadFiles(req, res, next) {
    let result = [];
    try {
        req.files.forEach(async element => {
            let filename = element.filename;
            let filepath = uploadPath;
            let filetype = element.mimetype.split('/')[0];
            let obj = {
                owner: req.body.owner,
                filename: filename,
                path: filepath,
                type: filetype,
                public: req.body.isPublic || true,
                tags: req.body.tags ||  []
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

// 
async function postUpdateFile(req, res, next) {
    let filename = req.body.filename;
    let owner = req.user._id;
    let tags = req.body.tags instanceof Array ? req.body.tags : undefined;
    let isPublic = req.body.isPublic;

    let dataUpdate = validator.validateRemove({isPublic, tags}, [undefined]);
    console.log(filename, owner, dataUpdate);
    File.methods.update(filename, owner, dataUpdate)
        .then(result => {
            console.log('upload line 110', result);
            return res.json({
                message: 'update file thành công'
            });
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({
                message: 'Update file thất bại'
            })
        });
}
module.exports = router;