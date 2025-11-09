import { prisma } from "../models/user.model.js";

export const userService = {
    getAll: () => prisma.user.findMany(),
    create: (data) => prisma.user.create({ data })
};
