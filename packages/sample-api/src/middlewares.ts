import { NextFunction, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import { RequestWithPayload } from "./types";


export const isAuthenticated = (req: RequestWithPayload, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        res.status(401);
        throw new Error('Access Denied');
    }

    try {
        const token = authorization.split(' ')[1];
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET ?? "");
        req.payload = payload;
    } catch (err: any) {
        res.status(401);
        if (err.name === 'TokenExpiredError') {
            throw new Error(err.name);
        }
        throw new Error('Access Denied');
    }

    return next();
}