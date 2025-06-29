import app from './app';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


const PORT = process.env.PORT || 3000;
console.log(`Starting server on port ${PORT}`);
async function createRole() {
  console.log('Creating role...');
  const role = await prisma.role.create({
    data: {
      role_name: 'ADMIN',
      role_description: 'Administrator role',
    },
  });
  console.log('Created role:', role);
}

createRole().catch(console.error).finally(() => prisma.$disconnect());
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
