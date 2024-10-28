import cron from 'node-cron';
import Booking from '../modules/user/models/booking-model.js';
import { Op } from 'sequelize';

class BookingStatusService {
    static startStatusUpdateJob() {
      cron.schedule("*/1 * * * *", async () => {
        try {
          const tenMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);
  
          // Find bookings with 'pending' status created more than 10 minutes ago
          const overdueBookings = await Booking.findAll({
            where: {
              status: "pending",
              createdAt: { [Op.lt]: tenMinutesAgo },
            },
          });
  
          // Update each overdue booking to 'failed'
          for (const booking of overdueBookings) {
            booking.status = "failed";
            await booking.save();
            console.log(`Booking ${booking.razorpayOrderId} status updated to 'failed' due to timeout.`);
          }
        } catch (error) {
          console.error("Error in BookingStatusService:", error);
        }
      });
  
      console.log("Booking status update job started.");
    }
  }
  
  export default BookingStatusService;