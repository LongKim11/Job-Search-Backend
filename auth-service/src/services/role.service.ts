import { Prisma, PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

const roleService = {
  getAllRoles: async (whereClause?: Prisma.RoleWhereInput) => {
    return prisma.role.findMany({
      where: whereClause,
      orderBy: { role_name: 'asc' },
    });
  },

  getRoleById: async (id: string): Promise<Role> => {
    const role = await prisma.role.findUnique({ where: { id } });
    if (!role) throw new Error('Role not found');
    return role;
  },

  createRole: async (data: {
    role_name: string;
    role_description?: string;
    isRoleAdmin?: boolean;
  }): Promise<Role> => {
    return await prisma.role.create({ data });
  },

  updateRole: async (
    id: string,
    data: {
      role_name?: string;
      role_description?: string;
      isRoleAdmin?: boolean;
    }
  ): Promise<Role> => {
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) throw new Error('Role not found');
    return await prisma.role.update({ where: { id }, data });
  },

  deleteRole: async (id: string): Promise<void> => {
    const existingRole = await prisma.role.findUnique({ where: { id } });
    if (!existingRole) throw new Error('Role not found');
    await prisma.role.delete({ where: { id } });
  },
};

export default roleService;
