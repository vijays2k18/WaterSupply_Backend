import UserStatus from "./UserStatus.js"; 

async function Approved(userId) {
    try {
      const userStatus = await UserStatus.findOne({ where: { user_id: userId } });
  
      if (userStatus) {
        // Update the existing record
        userStatus.requested = 2;
        userStatus.approved = 1;
        await userStatus.save();
        console.log('Status updated to Approved');
      } else {
        console.log('User status not found');
      }
    } catch (err) {
      console.error('Error updating status:', err.message);
    }
  }

  export default Approved;
  