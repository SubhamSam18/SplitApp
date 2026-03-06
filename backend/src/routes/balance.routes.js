const express = require("express");
const router = express.Router();
const Balance = require('../models/balance.model');
const authMiddleware = require('../middleware/auth.middleware');

router.get("/:groupId", authMiddleware, async(req,res) =>{
    try{
        const balances = await Balance.find({
            group: req.params.groupId
        }).populate("from to", "name");

        res.json(balances);
    }catch(err){
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;