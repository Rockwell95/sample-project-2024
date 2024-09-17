import jwt from 'jsonwebtoken';
import { isAuthenticated } from '../middlewares';
import { NextFunction, Response } from 'express';
import { RequestWithPayload } from '../types';

vi.mock('jsonwebtoken', () => ({
    default: {
        verify: vi.fn(),
    },
}));

describe('isAuthenticated middleware', () => {
    let mockRequest: Partial<RequestWithPayload>;
    let mockResponse: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockRequest = {
            headers: {},
        };
        mockResponse = {
            status: vi.fn().mockReturnThis(),
        };
        nextFunction = vi.fn();
        vi.stubEnv("JWT_ACCESS_SECRET", "test-secret")
    });

    it('should call next() if a valid token is provided', () => {
        const mockPayload = { userId: '123' };
        mockRequest.headers = { authorization: 'Bearer valid-token' };
        vi.mocked(jwt.verify).mockReturnValue(mockPayload);

        isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
        expect(mockRequest.payload).toEqual(mockPayload);
        expect(nextFunction).toHaveBeenCalled();
    });

    it('should throw an error if no authorization header is provided', () => {
        expect(() => {
            isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);
        }).toThrow('Access Denied');
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should throw an error if the token is invalid', () => {
        mockRequest.headers = { authorization: 'Bearer invalid-token' };
        vi.mocked(jwt.verify).mockImplementation(() => {
            throw new Error('Invalid token');
        });

        expect(() => {
            isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);
        }).toThrow('Access Denied');
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should throw a TokenExpiredError if the token has expired', () => {
        mockRequest.headers = { authorization: 'Bearer expired-token' };
        vi.mocked(jwt.verify).mockImplementation(() => {
            const error = new Error('Token expired') as Error & { name: string };
            error.name = 'TokenExpiredError';
            throw error;
        });

        expect(() => {
            isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);
        }).toThrow('TokenExpiredError');
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });

    it('should use an empty string as secret if JWT_ACCESS_SECRET is not set', () => {
        vi.stubEnv("JWT_ACCESS_SECRET", undefined)
        mockRequest.headers = { authorization: 'Bearer valid-token' };
        vi.mocked(jwt.verify).mockReturnValue({ userId: '123' });

        isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);

        expect(jwt.verify).toHaveBeenCalledWith('valid-token', '');
    });

    it('should throw an error if the authorization header is malformed', () => {
        mockRequest.headers = { authorization: 'InvalidFormat' };

        vi.mocked(jwt.verify).mockImplementation(() => { throw new Error() })

        expect(() => {
            isAuthenticated(mockRequest as RequestWithPayload, mockResponse as Response, nextFunction);
        }).toThrow('Access Denied');
        expect(mockResponse.status).toHaveBeenCalledWith(401);
        expect(nextFunction).not.toHaveBeenCalled();
    });
});