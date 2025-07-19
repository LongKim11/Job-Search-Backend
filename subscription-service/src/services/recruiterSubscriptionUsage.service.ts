import RecruiterSubscriptionUsage from '../models/recruiterSubscriptionUsage.model';

const recruiterSubscriptionUsageService = {
  create: async (data: {
    recruiter_subscription_id: string;
    post_id: string;
    post_type: string;
    status?: 'approved' | 'pending' | 'rejected';
  }) => {
    return await new RecruiterSubscriptionUsage({
      ...data,
      used_at: new Date(),
    }).save();
  },

  getByRecruiterSubscriptionId: async (id: string) => {
    return await RecruiterSubscriptionUsage.find({
      recruiter_subscription_id: id,
    }).sort({ used_at: -1 });
  },

  updateStatus: async (
    id: string,
    status: 'approved' | 'pending' | 'rejected'
  ) => {
    return await RecruiterSubscriptionUsage.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
  },
};

export default recruiterSubscriptionUsageService;
