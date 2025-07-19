import { redisPublisher } from '../core/redis.core';
import { JobStatus } from '../enums/jobStatus.enum';
import { RedisEvent } from '../enums/redisEvent.enum';
import { JobDocument } from '../interfaces/job.interface';
import Job from '../models/job.model';
import { generateUniqueSlug } from '../utils/slugify';

const jobService = {
  getAll: async ({
    page,
    limit,
    status,
    location_name,
    workplace_type,
    recruiter_profile_id,
  }: {
    page: number;
    limit: number;
    status?: string;
    location_name?: string;
    workplace_type?: string;
    recruiter_profile_id?: string;
  }) => {
    const query: any = {};
    if (status) query.status = status;
    if (location_name) query.location_name = location_name;
    if (workplace_type) query.workplace_type = workplace_type;
    if (recruiter_profile_id) query.recruiter_profile_id = recruiter_profile_id;

    const [total, data] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return { total, page, limit, data };
  },

  getByRecruiter: async ({
    recruiterId,
    page,
    limit,
    status,
  }: {
    recruiterId: string;
    page: number;
    limit: number;
    status?: string;
  }) => {
    const query: any = { recruiter_profile_id: recruiterId };
    if (status) query.status = status;

    const [total, data] = await Promise.all([
      Job.countDocuments(query),
      Job.find(query)
        .sort({ created_at: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
    ]);

    return { total, page, limit, data };
  },

  getDetail: async (slug: string) => {
    const job = await Job.findOne({ slug, status: JobStatus.APPROVED });
    if (!job) throw new Error('Job not found');

    job.views_count = (job.views_count || 0) + 1;
    await job.save();

    return job;
  },

  create: async (data: Partial<JobDocument>) => {
    const slug = await generateUniqueSlug(data.title || '');

    const job = new Job({
      ...data,
      slug,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedJob = await job.save();
    // Proccess only get neccessary fields for Redis event
    await redisPublisher.publish(
      RedisEvent.JOB_POST,
      JSON.stringify({
        job_id: savedJob._id,
        data: savedJob,
      })
    );

    return savedJob;
  },

  update: async (slug: string, data: Partial<JobDocument>) => {
    const job = await Job.findOne({ slug });
    if (!job) throw new Error('Job not found');

    const isTitleChanged = data.title && data.title !== job.title;

    Object.assign(job, data);

    if (isTitleChanged) {
      job.slug = await generateUniqueSlug(data.title!);
    }

    job.updated_at = new Date();
    return await job.save();
  },

  updateStatus: async (
    slug: string,
    status: JobStatus.PENDING | JobStatus.APPROVED | JobStatus.REJECTED
  ) => {
    const job = await Job.findOne({ slug });
    if (!job) throw new Error('Job not found');

    job.status = status.toString() as JobStatus;
    job.updated_at = new Date();
    return await job.save();
  },
};

export default jobService;
