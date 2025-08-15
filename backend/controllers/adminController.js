const User = require('../models/User');
const PostRequest = require('../models/PostRequest');

exports.getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('name email phone createdAt')
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRecentActivities = async (req, res) => {
  try {
    const lastRequests = await PostRequest.find({})
      .select('createdAt updatedAt status _id')
      .sort({ updatedAt: -1 })
      .limit(10);

    const reqActivities = lastRequests.map(r => ({
      ts: (r.updatedAt || r.createdAt),
      activity: r.status === 'pending' ? 'New Service Request posted' : `Request status updated to ${r.status}`,
      ref: `REQ:${String(r._id).slice(-6).toUpperCase()}`,
      status: r.status || '—'
    }));

    const lastUsers = await User.find({})
      .select('createdAt role _id')
      .sort({ createdAt: -1 })
      .limit(10);

    const userActivities = lastUsers.map(u => ({
      ts: u.createdAt,
      activity: u.role === 'worker' ? 'New Worker Registered' : 'New Customer Registered',
      ref: `${u.role === 'worker' ? 'WKR' : 'CST'}:${String(u._id).slice(-6).toUpperCase()}`,
      status: 'Active'
    }));

    const merged = [...reqActivities, ...userActivities]
      .sort((a, b) => new Date(b.ts) - new Date(a.ts))
      .slice(0, 15)
      .map(x => ({
        ...x,
        ts: new Date(x.ts).toISOString().replace('T', ' ').slice(0, 16)
      }));

    res.json(merged);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
