import JobType from '../models/jobType.model';
import { v4 as uuidv4 } from 'uuid';

const jobTypeService = {
  getAll: async (options: {
    isActive?: boolean;
    page?: number;
    limit?: number;
    noPage?: boolean;
  }) => {
    const query: any = {};
    if (options.isActive !== undefined) {
      query.isActive = options.isActive;
    }

    if (options.noPage) {
      const data = await JobType.find(query).sort({ createdAt: -1 });
      return { total: data.length, data };
    }

    if (options.page !== undefined && options.limit !== undefined) {
      const skip = (options.page - 1) * options.limit;
      const total = await JobType.countDocuments(query);
      const data = await JobType.find(query)
        .skip(skip)
        .limit(options.limit)
        .sort({ createdAt: -1 });
      return { total, data, page: options.page, limit: options.limit };
    }

    const data = await JobType.find(query).sort({ createdAt: -1 });
    return { total: data.length, data };
  },

  create: async (data: { title: string }) => {
    const jobType = new JobType({ title: data.title });
    return await jobType.save();
  },

  bulkCreate: async (data: { title: string }[]) => {
    const payload = data.map((item) => ({
      _id: uuidv4(),
      title: item.title,
      isActive: true,
    }));
    return await JobType.insertMany(payload);
  },

  update: async (id: string, data: { title?: string; isActive?: boolean }) => {
    const updated = await JobType.findByIdAndUpdate(id, data, { new: true });
    if (!updated) throw new Error('Job type not found');
    return updated;
  },

  toggleActive: async (id: string) => {
    const item = await JobType.findById(id);
    if (!item) throw new Error('Job type not found');
    item.isActive = !item.isActive;
    return await item.save();
  },
};

export default jobTypeService;