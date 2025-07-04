import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const jobSeekerProfileService = {
    getAll: async (page = 1, limit = 10) => {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.jobSeekerProfile.findMany({
                skip,
                take: limit,
                orderBy: { created_at: 'desc' },
            }),
            prisma.jobSeekerProfile.count(),
        ]);

        return {
            data,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    },


    getById: (id: string) => {
        return prisma.jobSeekerProfile.findUniqueOrThrow({ where: { id } });
    },

    create: (data: any) => {
        return prisma.jobSeekerProfile.create({
            data: {
                id: uuidv4(),
                ...data,
            },
        });
    },

    update: (id: string, data: any) => {
        return prisma.jobSeekerProfile.update({
            where: { id },
            data,
        });
    },

    remove: (id: string) => {
        return prisma.jobSeekerProfile.delete({ where: { id } });
    },
};

export default jobSeekerProfileService;
