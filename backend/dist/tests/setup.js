"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
beforeAll(async () => {
    // Set test environment variables
    process.env.JWT_SECRET = 'test-secret';
    process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5433/civiccrm';
});
afterAll(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=setup.js.map