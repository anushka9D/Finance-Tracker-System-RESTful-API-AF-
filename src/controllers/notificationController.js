const Notification = require('../models/notificationModel');
const User = require('../models/userModel');

exports.getNotifications = async (req, res) => {
  try {

    const userId = req.user.userId;
                
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notifications = await Notification.find({ userId: userId });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};

exports.markAsRead = async (req, res) => {
  try {

    const userId = req.user.userId;
                
    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    const notification = await Notification.findOneAndUpdate( { _id: req.params.id, userId: userId },
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: 'Notification not found' });

    res.status(200).json(notification);
    
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
    }
};