import Queue, { Queue as QueueInterface, QueueOptions} from "bull";
import { getDomainUrlForCron } from "../services/domain/domain.service";
const dailyVitalStatusUpdateQueue: QueueInterface = new Queue("dailyVitalStatusUpdateQueue",
{ redis: { port: process.env.REDIS_PORT, host: process.env.REDIS_URL } } as QueueOptions)

export const createCronJob = async () => {
 const jobs = await dailyVitalStatusUpdateQueue.getRepeatableJobs();
 if(jobs.length > 0) {
   dailyVitalStatusUpdateQueue.removeRepeatableByKey(jobs[0].key);
 }
 dailyVitalStatusUpdateQueue.process(getDomainUrlForCron).catch(err => console.log("While processing getDomainUrlForCron : ", err));
 dailyVitalStatusUpdateQueue.add({},{
   repeat: { cron: "43 2 * * *"}
 })
}
