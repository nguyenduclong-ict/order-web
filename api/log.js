const router = require('express').Router();
const Log = require('../models/Log');
const validator = require('../helpers/Validator');
router.get('/:from-:page-:type-:sort', getLog);
router.post('/', postLog);

async function getLog (req, res) {
    let from = Number(req.parms.from);
    let page = Number(req.parms.page);
    let sort = Number(req.parms.sort);
    let type = req.parms.type;
    let query = validator.validateRemove({type}, ['all', undefined]);
    Log.find()
        .skip(from)
        .limit(page)
        .sort({created : sort || 1})
        .then(data => {
            return res.json(data);
        })
        .catch(err=> {
            console.log(err);
            return res.status(500).json({message : err.message});
        })
}


async function postLog (req, res) {

}

module.exports = router;