const Goal = require('../models/goalModel');
const User = require('../models/userModel');

exports.createGoal = async (req, res) => {
  try {

        const {name, targetAmount, currentAmount, currency, deadline} = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

    const goal = new Goal({ userId, name, targetAmount, currentAmount, currency, deadline });

    await goal.save();
    res.status(201).json({ message: 'Goal created Successfully'});

  } catch (error){
    res.status(500).json({error: 'Internal server error'});
    }
};

exports.getGoals = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    const goals = await Goal.find({ userId: userId });
    res.status(200).json({goals});

  } catch (error){
    res.status(500).json({error: 'Internal server error'});
    }
};

exports.updateProgress = async (req, res) => {
  try {
    const {id} = req.params;
    const {currentAmount} = req.body;
    const userId = req.user.userId;

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const goal = await Goal.findOneAndUpdate({ _id: id, userId: userId },
      { currentAmount},
      { new: true }
    );

    if (!goal) return res.status(404).json({ message: 'Goal not found' });

    res.status(200).json({message: 'Goal update successfully',goal});
  } catch (error){
    res.status(500).json({error: 'Internal server error'});
    }
};