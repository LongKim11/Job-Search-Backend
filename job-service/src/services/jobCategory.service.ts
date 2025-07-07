import JobCategory from '../models/jobCategory.model';

export const jobCategoryService = {
  add: async (payload: { title: string }) => {
    return await JobCategory.create({ title: payload.title });
  },

  bulkAdd: async (items: { title: string }[]) => {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error('Invalid or empty input array');
    }

    return await Promise.all(
      items.map((item) => JobCategory.create({ title: item.title }))
    );
  },

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
      const data = await JobCategory.find(query).sort({ createdAt: -1 });
      return { total: data.length, data };
    }

    if (options.page !== undefined && options.limit !== undefined) {
      const skip = (options.page - 1) * options.limit;
      const total = await JobCategory.countDocuments(query);
      const data = await JobCategory.find(query)
        .skip(skip)
        .limit(options.limit)
        .sort({ createdAt: -1 });
      return { total, data, page: options.page, limit: options.limit };
    }

    const data = await JobCategory.find(query).sort({ createdAt: -1 });
    return { total: data.length, data };
  },

  update: async (id: string, payload: { title: string }) => {
    const updated = await JobCategory.findByIdAndUpdate(
      id,
      { title: payload.title },
      { new: true }
    );
    if (!updated) throw new Error('Job category not found');
    return updated;
  },

  toggleIsActive: async (id: string) => {
    const jobCategory = await JobCategory.findById(id);
    if (!jobCategory) throw new Error('Job category not found');

    jobCategory.isActive = !jobCategory.isActive;
    await jobCategory.save();
    return jobCategory;
  }
};
