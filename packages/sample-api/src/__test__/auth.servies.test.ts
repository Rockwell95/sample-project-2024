import { db } from "../db";
import { hashToken } from "../hashToken";
import {
    addRefreshTokenToWhitelist,
    findRefreshTokenById,
    deleteRefreshToken,
    revokeTokens,
} from "../auth.services";
import { Mock } from "vitest";

// Mock the db and hashToken modules
vi.mock("../db", () => ({
    db: {
        refreshToken: {
            create: vi.fn(),
            findUnique: vi.fn(),
            update: vi.fn(),
            updateMany: vi.fn(),
        },
    },
}));

vi.mock("../hashToken", () => ({
    hashToken: vi.fn(),
}));

describe("Refresh Token Functions", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe("addRefreshTokenToWhitelist", () => {
        it("should add a refresh token to the whitelist", async () => {
            const mockToken = {
                jti: "test-jti",
                refreshToken: "test-refresh-token",
                userId: "test-user-id",
            };

            (hashToken as Mock).mockReturnValue("hashed-token");
            (db.refreshToken.create as Mock).mockResolvedValue({ ...mockToken, hashedToken: "hashed-token" });

            const result = await addRefreshTokenToWhitelist(mockToken);

            expect(db.refreshToken.create).toHaveBeenCalledWith({
                data: {
                    id: mockToken.jti,
                    hashedToken: "hashed-token",
                    userId: mockToken.userId,
                },
            });

            expect(result).toEqual({ ...mockToken, hashedToken: "hashed-token" });
        });
    });

    describe("findRefreshTokenById", () => {
        it("should find a refresh token by id", async () => {
            const mockToken = { id: "test-id", hashedToken: "hashed-token", userId: "test-user-id" };
            (db.refreshToken.findUnique as Mock).mockResolvedValue(mockToken);

            const result = await findRefreshTokenById("test-id");

            expect(db.refreshToken.findUnique).toHaveBeenCalledWith({
                where: { id: "test-id" },
            });

            expect(result).toEqual(mockToken);
        });
    });

    describe("deleteRefreshToken", () => {
        it("should soft delete a refresh token", async () => {
            const mockToken = { id: "test-id", revoked: true };
            (db.refreshToken.update as Mock).mockResolvedValue(mockToken);

            const result = await deleteRefreshToken("test-id");

            expect(db.refreshToken.update).toHaveBeenCalledWith({
                where: { id: "test-id" },
                data: { revoked: true },
            });

            expect(result).toEqual(mockToken);
        });
    });

    describe("revokeTokens", () => {
        it("should revoke all tokens for a user", async () => {
            const mockResult = { count: 2 };
            (db.refreshToken.updateMany as Mock).mockResolvedValue(mockResult);

            const result = await revokeTokens("test-user-id");

            expect(db.refreshToken.updateMany).toHaveBeenCalledWith({
                where: { userId: "test-user-id" },
                data: { revoked: true },
            });

            expect(result).toEqual(mockResult);
        });
    });
});