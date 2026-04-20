import cron from 'node-cron';
import redisServer from '../Database/redis.js';
import { Todo ,User } from '../models/userModel.js';


async function clearGuestDB(){
    try {
        const keys = await redisServer.keys('guest_user:userId:*');
        for (const key of keys) {
            const userId = key.split(':')[2];
            await Todo.deleteMany({userId});
            await User.findByIdAndDelete(userId);
            await redisServer.del(key);
            console.log(`Deleted guest user with userId ${userId} and their todos from Redis cache and database`);
        }
    } catch (error) {
        console.error('Error in clearGuestDB:', error);
    }
}

cron.schedule('0 * * * *', async () => {
    try {
        await clearGuestDB();
        console.log('Running daily cleanup task at midnight');
    } catch (error) {
        console.error('Error in daily cleanup task:', error);
    }
});