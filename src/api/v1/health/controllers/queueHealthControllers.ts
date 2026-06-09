import { Request, Response, NextFunction } from 'express';
import queues from '../../../../core/services/bull/bullMQ';

export async function getQueueHealth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get counts for each queue
    const incomingEthCounts = await queues.incomingEthQueue.getJobCounts();
    const outgoingEthCounts = await queues.outgoingEthQueue.getJobCounts();
    const walletBalanceCounts = await queues.walletBalanceQueue.getJobCounts();

    // Get recent jobs
    const incomingEthJobs = await queues.incomingEthQueue.getJobs(
      ['completed', 'failed', 'active'],
      0,
      10,
    );
    const outgoingEthJobs = await queues.outgoingEthQueue.getJobs(
      ['completed', 'failed', 'active'],
      0,
      10,
    );

    return res.status(200).json({
      success: true,
      timestamp: new Date().toISOString(),
      queues: {
        incomingEth: {
          counts: incomingEthCounts,
          recentJobs: incomingEthJobs.map((job) => ({
            id: job.id,

            progress: job.progress,
            timestamp: job.timestamp,
            attempts: job.attemptsMade,
          })),
        },
        outgoingEth: {
          counts: outgoingEthCounts,
          recentJobs: outgoingEthJobs.map((job) => ({
            id: job.id,
            progress: job.progress,
            timestamp: job.timestamp,
            attempts: job.attemptsMade,
          })),
        },
        walletBalance: {
          counts: walletBalanceCounts,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching queue health:', error);
    next(error);
  }
}
