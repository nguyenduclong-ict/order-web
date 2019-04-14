// router path : /api/Category
const express = require('express');
var router = express.Router();
var Category = require('../../models/Category');
var File = require('../../models/File');

router.get('/list/:parentId:-from-:page', getList)

async function getList (req, res)  {
    let parentId = req.params.parentId == 'root' ? undefined : req.params.parentId;
    let from = req.params.from;
    let page = req.params.page;
    Category.getList()
};

router.get('/detail/:id', (req, res) => {
    console.log('get Category by id : ' + req.params.id);
    let CategoryId = req.params.id;
    Category.findOne({
        _id: CategoryId
    }, (err, docs) => {
        if (docs)
            res.json(docs);
        else res.json({
            error: "Category khong ton tai"
        })
    })
});

// Add Category
router.post('/add', (req, res) => {
    let data = req.body;
    let imageId = req.body.imageId;
    console.log(data);
    let category = new Category(data);
    category.save()
        .then((doc) => {
            if(imageId) {
                File.updateOne({_id : imageId}, {$push : {subOnwer : doc._id}} , (err, doc) => {
                    return res.json({message : "Add Category success", data : doc})
                });
            }
            return res.json({message : "Add Category success", data : doc})
        })
        .catch((err) => {
            return res.json({error : true , message : err.message})            
        });
});


// Edit Category
router.post('/edit/:id', (req, res) => {
    let query = {_id : req.params.id};
    let imageId = req.body.imageId;
    let data = req.body;
    console.log(data);
    
    Category.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({error : "Xay ra loi", message : err.message});
        } else {
            if(imageId) {
                File.updateOne({_id : imageId}, {$push : {subOnwer : req.params.id}}, (err, doc) => {
                    console.log('Update Category ' + req.params.id + 'success!');
                    return res.json({message : 'update success!'});                    
                })
            }
            console.log('Update Category ' + req.params.id + 'success!');
            return res.json({message : 'update success!'});
        }
    });
});

module.exports = router;