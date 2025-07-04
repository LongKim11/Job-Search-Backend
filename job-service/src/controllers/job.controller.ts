import { Request, Response } from 'express';
import { Job } from '../models/job.model';

export const createJob = async (req: Request, res: Response) => {
  try {
    const job = new Job(req.body);
    await job.save();
    res.status(201).json({ success: true, data: job });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getJobs = async (_req: Request, res: Response) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json({ success: true, data: jobs });
};
