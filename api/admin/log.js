const router = require("express").Router();
const Log = require("../../models/Log");
const validator = require("../../helpers/Validator");

router.get("/", getListLog);
router.get("/:id", getLog);

async function getListLog(req, res) {
  let { from, page, type, sort } = req.query;
  Log.methods
    .getLogs(from, page, type, sort)
    .then(list => res.json(list))
    .catch(err => {
      console.log(err);
      return res.json([]);
    });
}

async function getLog(req,res) {
  let id = req.params.id;
  Log.methods
    .getLogById(id)
    .then(log => {
      return res.json(log);
    })
    .catch(err => {
      console.log(err);
      return res.status(404).send({ message: "log not exist" });
    });
}

module.exports = router;
