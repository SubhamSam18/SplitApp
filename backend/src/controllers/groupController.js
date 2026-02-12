const Group = require("../models/Group");

exports.createGroup = async (req,res) => {
    try{
        const {name, members} = req.body;
        const group = await Group.create({
            name,
            createdBy: req.user.userId,
            members: [req.user.userId, ...members]
        });
        console.log("Group: "+ group);
        res.status(201).json({message: "Group Created"});
    }catch(err){
        res.status(500).json({message: "Internal server error"});
    }
}

exports.getUserGroup = async (req,res) => {
    try {
        const groups = await Group.find({
            members: req.user.userId
        }).populate("members", "name email");

        res.status(200).json(groups);
    }catch(error){
        res.status(500).json({message: "Internal Server Error!"});
    }
}