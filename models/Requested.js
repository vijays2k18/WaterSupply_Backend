import UserStatus from "./UserStatus.js";  // Import the UserStatus model

async function Requested(userId) {
  try {
    const userStatus = await UserStatus.findOne({ where: { user_id: userId } });
    
    if (!userStatus) {
      // Create a new record if not found
      await UserStatus.create({ user_id: userId, requested: 1, approved: 0 });
    } else {
      // Update the existing record
      userStatus.requested = 1;
      userStatus.approved = 0;
      await userStatus.save();
    }
    console.log('Status updated to Requested');
  } catch (err) {
    console.error('Error updating status:', err.message);
  }
}

export default Requested;
