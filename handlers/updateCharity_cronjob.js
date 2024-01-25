import Cron from 'cron';
const CronJob = Cron.CronJob;
import updateAnimalCharityListJson from './updateAnimalCharityListJson.js';

// cron schedule (every 24 hours at 12:00 AM in this example)
const cronSchedule = '0 0 * * *';

// Create the cron job
const job = new CronJob(cronSchedule, async function() {
  console.log('updating the stored animal realted charity list...');
  await updateAnimalCharityListJson();
});

// Start the cron job
job.start();

console.log(`Cron job scheduled with "${cronSchedule}"`);
