import { Request, RequestHandler } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface TokenWhitelist { jti: string, refreshToken: string, userId: string }

export interface RequestWithPayload extends Request<any> {
    payload: string | JwtPayload
}