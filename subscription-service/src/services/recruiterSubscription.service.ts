import RecruiterSubscription from '../models/recruiterSubscription.model';

const recruiterSubscriptionService = {
  getAllByRecruiter: async (recruiterId: string) => {
    return await RecruiterSubscription.find({
      recruiter_profile_id: recruiterId,
    })
      .populate('subscription_plan_id')
      .sort({ created_at: -1 });
  },

  getAll: async () => {
    // Admin: get all subscriptions
    return await RecruiterSubscription.find()
      .populate('subscription_plan_id')
      .sort({ created_at: -1 });
  },

  getByRecruiterId: async (recruiterId: string) => {
    // Admin: get subscriptions of a specific recruiter
    return await RecruiterSubscription.find({
      recruiter_profile_id: recruiterId,
    })
      .populate('subscription_plan_id')
      .sort({ created_at: -1 });
  },

  create: async (data: {
    subscription_plan_id: string;
    recruiter_profile_id: string;
    price: number;
    expired_at: Date;
    payment_id?: string;
  }) => {
    const sub = new RecruiterSubscription({
      ...data,
      status: 'active',
      created_at: new Date(),
    });
    return await sub.save();
  },

  cancel: async (id: string, recruiterId: string) => {
    const subscription = await RecruiterSubscription.findOne({
      _id: id,
      recruiter_profile_id: recruiterId,
      status: 'active',
    });

    if (!subscription) throw new Error('Active subscription not found');
    subscription.status = 'canceled';
    subscription.canceled_at = new Date();
    return await subscription.save();
  },
};

export default recruiterSubscriptionService;
