// src/helpers/cleanup-helper.js
import TemporaryOTP from '../modules/user/models/temp-otp-storage.js'; // Adjust the path accordingly
import { Op } from 'sequelize';

const CleanupHelper = {
    async deleteExpiredOTPs() {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // Current time minus 1 hour
        await TemporaryOTP.destroy({
            where: {
                createdAt: {
                    [Op.lt]: oneHourAgo, // Delete records older than one hour
                },
            },
        });
        console.log('Expired OTPs deleted successfully.');
    },
};

export default CleanupHelper;
