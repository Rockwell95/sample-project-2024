import { User } from "@prisma/client";
import { db } from "./db";
import bcrypt from "bcrypt"

export const findUserByEmail = (email: string) => {
    return db.user.findUnique({
        where: {
            email,
        },
    });
}

export const createUserByEmailAndPassword = (user: Pick<User, "password" | "email">) => {
    user.password = bcrypt.hashSync(user.password, 12);
    return db.user.create({
        data: user,
    });
}

export const findUserById = (id: string) => {
    return db.user.findUnique({
        where: {
            id,
        },
    });
}