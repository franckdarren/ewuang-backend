import { userService } from "../services/user.service.js";
import { userSchema } from "../validations/user.schema.js";

export const userController = {
    getAll: async (req, res, next) => {
        try {
            const users = await userService.getAll();
            res.json(users);
        } catch (err) {
            next(err);
        }
    },

    create: async (req, res, next) => {
        try {
            const data = userSchema.parse(req.body);
            const newUser = await userService.create(data);
            res.status(201).json(newUser);
        } catch (err) {
            next(err);
        }
    }
};
