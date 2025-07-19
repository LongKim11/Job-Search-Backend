import { SubscriptionPlanDocument } from '../interfaces/subscriptionPlan.interface';
import SubscriptionPlan from '../models/subscriptionPlan.model';

const subscriptionPlanService = {
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
      const data = await SubscriptionPlan.find(query).sort({ createdAt: -1 });
      return { total: data.length, data };
    }

    if (options.page !== undefined && options.limit !== undefined) {
      const skip = (options.page - 1) * options.limit;
      const total = await SubscriptionPlan.countDocuments(query);
      const data = await SubscriptionPlan.find(query)
        .skip(skip)
        .limit(options.limit)
        .sort({ createdAt: -1 });
      return { total, data, page: options.page, limit: options.limit };
    }

    const data = await SubscriptionPlan.find(query).sort({ createdAt: -1 });
    return { total: data.length, data };
  },

  create: async (data: {
    name: string;
    price: number;
    normal_post_limit: number;
    featured_post_limit: number;
    duration: string;
  }) => {
    const plan = new SubscriptionPlan(data);
    return await plan.save();
  },

  update: async (
    id: string,
    data: Partial<Omit<SubscriptionPlanDocument, '_id'>>
  ) => {
    const updated = await SubscriptionPlan.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!updated) throw new Error('Subscription plan not found');
    return updated;
  },

  toggleActive: async (id: string) => {
    const item = await SubscriptionPlan.findById(id);
    if (!item) throw new Error('Subscription plan not found');
    item.isActive = !item.isActive;
    return await item.save();
  },
};

export default subscriptionPlanService;
