import UserStatus from "./UserStatus.js"; 

async function Delivery(userId) {
    try {
      const userStatus = await UserStatus.findOne({ where: { user_id: userId } });
  
      if (userStatus) {
        // Update the existing record
        userStatus.requested = 3;
        userStatus.approved = 2;
        await userStatus.save();
        console.log('Status updated to Delivery');
      } else {
        console.log('User status not found');
      }
    } catch (err) {
      console.error('Error updating status:', err.message);
    }
  }
  export default Delivery;
  