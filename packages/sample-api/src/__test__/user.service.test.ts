import { findUserByEmail, createUserByEmailAndPassword, findUserById } from '../user.services';
import { db } from '../db';
import bcrypt from 'bcryptjs';

vi.mock('../db', () => ({
    db: {
        user: {
            findUnique: vi.fn(),
            create: vi.fn(),
        },
    },
}));

vi.mock('bcryptjs', () => ({
    default: {
        hashSync: vi.fn(),
    },
}));

describe('User Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findUserByEmail', () => {
        it('should find a user by email', async () => {
            const mockUser = { id: '1', email: 'test@example.com', password: 'hashedPassword' };
            vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);

            const result = await findUserByEmail('test@example.com');

            expect(result).toEqual(mockUser);
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return null if user is not found', async () => {
            vi.mocked(db.user.findUnique).mockResolvedValue(null);

            const result = await findUserByEmail('nonexistent@example.com');

            expect(result).toBeNull();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'nonexistent@example.com' },
            });
        });
    });

    describe('createUserByEmailAndPassword', () => {
        it('should create a user with hashed password', async () => {
            const mockUser = { email: 'new@example.com', password: 'password123' };
            const hashedPassword = 'hashedPassword123';
            const createdUser = { ...mockUser, id: '2', password: hashedPassword };

            vi.mocked(bcrypt.hashSync).mockReturnValue(hashedPassword);
            vi.mocked(db.user.create).mockResolvedValue(createdUser);

            const result = await createUserByEmailAndPassword(mockUser);

            expect(result).toEqual(createdUser);
            expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 12);
            expect(db.user.create).toHaveBeenCalledWith({
                data: { ...mockUser, password: hashedPassword },
            });
        });
    });

    describe('findUserById', () => {
        it('should find a user by id', async () => {
            const mockUser = { id: '3', email: 'user3@example.com', password: 'hashedPassword' };
            vi.mocked(db.user.findUnique).mockResolvedValue(mockUser);

            const result = await findUserById('3');

            expect(result).toEqual(mockUser);
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { id: '3' },
            });
        });

        it('should return null if user is not found', async () => {
            vi.mocked(db.user.findUnique).mockResolvedValue(null);

            const result = await findUserById('999');

            expect(result).toBeNull();
            expect(db.user.findUnique).toHaveBeenCalledWith({
                where: { id: '999' },
            });
        });
    });
});