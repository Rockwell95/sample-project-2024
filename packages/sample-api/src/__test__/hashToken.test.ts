import crypto from 'crypto';
import { hashToken } from '../hashToken';

vi.mock('crypto', () => ({
    default: {
        createHash: vi.fn(() => ({
            update: vi.fn(() => ({
                digest: vi.fn(),
            })),
        })),
    },
}));

describe('hashToken', () => {
    it('should create a SHA-512 hash of the given token', () => {
        const mockToken = 'testToken123';
        const mockHashedToken = 'hashedTestToken123';

        const mockDigest = vi.fn().mockReturnValue(mockHashedToken);
        const mockUpdate = vi.fn().mockReturnValue({ digest: mockDigest });
        const mockCreateHash = vi.fn().mockReturnValue({ update: mockUpdate });

        const spy = vi.spyOn(crypto, "createHash").mockImplementation(mockCreateHash);

        const result = hashToken(mockToken);

        expect(crypto.createHash).toHaveBeenCalledWith('sha512');
        expect(mockUpdate).toHaveBeenCalledWith(mockToken);
        expect(mockDigest).toHaveBeenCalledWith('hex');
        expect(result).toBe(mockHashedToken);
        spy.mockRestore();
    });

    it('should return different hashes for different tokens', () => {
        const token1 = 'token1';
        const token2 = 'token2';

        // Use the actual crypto module for this test
        vi.unmock('crypto');

        const hash1 = hashToken(token1);
        const hash2 = hashToken(token2);

        expect(hash1).not.toBe(hash2);
    });

    it('should return the same hash for the same token', () => {
        const token = 'consistentToken';

        // Use the actual crypto module for this test
        vi.unmock('crypto');

        const hash1 = hashToken(token);
        const hash2 = hashToken(token);

        expect(hash1).toBe(hash2);
    });

    it('should return a 128-character hex string', () => {
        const token = 'testToken';

        // Use the actual crypto module for this test
        vi.unmock('crypto');

        const hash = hashToken(token);

        expect(hash).toMatch(/^[a-f0-9]{128}$/);
    });
});