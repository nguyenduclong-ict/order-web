// router path : /api/Category
const express = require('express');
var router = express.Router();
var Category = require('../../models/Category');

router.get('/list', (req, res) => {
    Category.find({}, (err, docs) => {
        res.json(docs);
    })
});

router.get('/:id', (req, res) => {
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
    console.log(data);
    let category = new Category(data);
    category.save()
        .then((doc) => {
            return res.json({message : "Add Category success", data : doc})
        })
        .catch((err) => {
            return res.json({error : true , message : err.message})            
        })
})

// Edit Category
router.post('/edit/:id', (req, res) => {
    let query = {_id : req.params.id};
    let data = req.body;
    console.log(data);
    
    Category.updateOne(query, data, (err) => {
        if(err) {
            console.log(err);
            return res.json({error : "Xay ra loi", message : err.message});
        } else {
            console.log('Update Category ' + req.params.id + 'success!');
            return res.json({message : 'update success!'});
        }
    });
})
module.exports = router;