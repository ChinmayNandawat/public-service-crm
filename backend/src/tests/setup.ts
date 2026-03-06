import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Set test environment variables
  process.env.JWT_SECRET = 'test-secret';
  process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/civiccrm';
});

afterAll(async () => {
  await prisma.$disconnect();
});
