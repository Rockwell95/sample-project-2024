import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken, generateTokens } from '../jwt'; // Assuming the original code is in this file
import { User } from '@prisma/client';

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
    },
}));

describe('Token Service', () => {
    const mockUser: User = { id: "1", email: 'Test@test.com', password: "salted-password", createdAt: new Date(), updatedAt: new Date() };
    const mockJti = 'test-jti';

    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubEnv("JWT_ACCESS_SECRET", 'test-access-secret');
        vi.stubEnv("JWT_REFRESH_SECRET", 'test-refresh-secret');
    });

    describe('generateAccessToken', () => {
        it('should generate an access token with correct parameters', () => {
            vi.mocked(jwt.sign).mockReturnValue('mocked-access-token');

            const result = generateAccessToken(mockUser);

            expect(result).toBe('mocked-access-token');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id },
                'test-access-secret',
                { expiresIn: '5m' }
            );
        });

        it('should use an empty string as secret if JWT_ACCESS_SECRET is not set', () => {
            vi.stubEnv("JWT_ACCESS_SECRET", undefined);
            vi.mocked(jwt.sign).mockReturnValue('mocked-access-token');

            generateAccessToken(mockUser);

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id },
                '',
                { expiresIn: '5m' }
            );
        });
    });

    describe('generateRefreshToken', () => {
        it('should generate a refresh token with correct parameters', () => {
            vi.mocked(jwt.sign).mockReturnValue('mocked-refresh-token');

            const result = generateRefreshToken(mockUser, mockJti);

            expect(result).toBe('mocked-refresh-token');
            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id, jti: mockJti },
                'test-refresh-secret',
                { expiresIn: '8h' }
            );
        });

        it('should use an empty string as secret if JWT_REFRESH_SECRET is not set', () => {
            vi.stubEnv("JWT_REFRESH_SECRET", undefined);
            vi.mocked(jwt.sign).mockReturnValue('mocked-refresh-token');

            generateRefreshToken(mockUser, mockJti);

            expect(jwt.sign).toHaveBeenCalledWith(
                { userId: mockUser.id, jti: mockJti },
                '',
                { expiresIn: '8h' }
            );
        });
    });

    describe('generateTokens', () => {
        it('should generate both access and refresh tokens', () => {
            vi.mocked(jwt.sign)
                .mockReturnValueOnce('mocked-access-token')
                .mockReturnValueOnce('mocked-refresh-token');

            const result = generateTokens(mockUser, mockJti);

            expect(result).toEqual({
                accessToken: 'mocked-access-token',
                refreshToken: 'mocked-refresh-token',
            });
            expect(jwt.sign).toHaveBeenCalledTimes(2);
        });
    });
});