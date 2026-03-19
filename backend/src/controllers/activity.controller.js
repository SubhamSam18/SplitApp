const Activity = require("../models/activity.model");

exports.addActivity = async (req, res) => {
    try {
        const { groupId, description, amount, paidBy, splits } = req.body.data || req.body;
        const descriptionContent = `${req.user.userName} added an expense of ${amount} for ${description}`;
        const activity = new Activity({
            groupId,
            description: descriptionContent,
            amount,
            paidBy,
            createdBy: req.user.userName,
            splits
        });
        await activity.save();
        res.status(201).json({ message: "Activity added successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ "splits.user": req.user.userId }).sort({ createdAt: -1 });
        res.status(200).json({ activities, currentUserId: req.user.userId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}