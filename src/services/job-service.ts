import schedule from 'node-schedule';

import { Logger } from '.';
import { Job } from '../jobs';

let Logs = require('../../lang/logs.json');

export class JobService {
    constructor(private jobs: Job[]) { }

    public start(): void {
        for (let job of this.jobs) {
            schedule.scheduleJob(job.schedule, async () => {
                try {
                    if (job.log) {
                        Logger.info(Logs.info.jobRun.replaceAll('{JOB}', job.name));
                    }

                    await job.run();

                    if (job.log) {
                        Logger.info(Logs.info.jobCompleted.replaceAll('{JOB}', job.name));
                    }
                } catch (error) {
                    Logger.error(Logs.error.job.replaceAll('{JOB}', job.name), error);
                }
            });
            Logger.info(
                Logs.info.jobScheduled
                    .replaceAll('{JOB}', job.name)
                    .replaceAll('{SCHEDULE}', job.schedule)
            );
        }
    }
}
