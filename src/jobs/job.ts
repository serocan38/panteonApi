import cron from 'node-cron';
import JobService from '../service/jobService';
import UserRepository from '../repositoy/userRepository';
import { User } from '../entity/user';
import { faker } from '@faker-js/faker';
import TransactionRepository from '../repositoy/transactionRepository';
import { Transaction } from '../entity/transaction';

export default class JobScheduler {
    private jobService: JobService;
    private weeklyJob: cron.ScheduledTask;
    private fiveMinuteJob: cron.ScheduledTask;

    constructor(jobService: JobService) {
        this.jobService = jobService;

        this.weeklyJob = cron.schedule('0 2 * * 1', this.weeklyJobHandler.bind(this));

        this.fiveMinuteJob = cron.schedule('*/5 * * * *', this.fiveMinuteJobHandler.bind(this));
    }
    private async weeklyJobHandler() {
        console.log('Weekly job is running: ', new Date().toISOString());
        try {
            await this.jobService.resetAndRewardUsers();
        } catch (error) {
            console.error('Weekly Job Error:', error);
        }
    }
    private async fiveMinuteJobHandler() {
        console.log('5-Minute job is running: ', new Date().toISOString());
        try {
            await this.jobService.leadershipHandler();
        } catch (error) {
            console.error('5-Minute Job Error:', error);
        }
    }

    private async createUser() {
        const userRepository = new UserRepository()
        const users: User[] = [];
        for (let index = 0; index < 5000; index++) {
            const user = new User();

            const randomNumber = BigInt(faker.number.int({ min: 1, max: 232 }))

            user.username = faker.internet.userName();
            user.country = { id: randomNumber } as any

            users.push(user)
        }
        userRepository.bulkInsert(users);
    }
    private async createTransaction() {
        console.log("STARTTTTT")

        const transactionRepository = new TransactionRepository()
        const transactions: Transaction[] = [];
        for (let index = 0; index < 5000; index++) {
            const transaction = new Transaction();

            const randomNumber = faker.number.int({ min: 1, max: 5000 })
            const randomValue = faker.number.int({ min: 1, max: 5000 })

            transaction.value = randomValue;

            transaction.user = { id: randomNumber as any } as User
            transactions.push(transaction)
        }
        await transactionRepository.bulkInsert(transactions);
        console.log("OKKKK")
    }

    start() {
        this.weeklyJob.start();
        this.fiveMinuteJob.start();
        console.log('Job scheduler started.');
    }

    stop() {
        this.weeklyJob.stop();
        this.fiveMinuteJob.stop();
        console.log('Job scheduler stopped.');
    }
}