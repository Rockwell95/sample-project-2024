import { findBook, createBook, checkBookExists, updateBook } from '../book.services';
import { db } from '../db';

vi.mock('../db', () => ({
    db: {
        book: {
            findUnique: vi.fn(),
            create: vi.fn(),
            findFirst: vi.fn(),
            update: vi.fn(),
        },
    },
}));

describe('Book Service', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('findBook', () => {
        it('should find a book by id when given a valid number', async () => {
            const mockBook = { id: 1, title: 'Test Book' };
            vi.mocked(db.book.findUnique).mockResolvedValue(mockBook);

            const result = await findBook(1);
            expect(result).toEqual(mockBook);
            expect(db.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should find a book by id when given a valid string number', async () => {
            const mockBook = { id: 1, title: 'Test Book' };
            vi.mocked(db.book.findUnique).mockResolvedValue(mockBook);

            const result = await findBook('1');
            expect(result).toEqual(mockBook);
            expect(db.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should return null for invalid id', async () => {
            const result = await findBook('invalid');
            expect(result).toBeNull();
            expect(db.book.findUnique).not.toHaveBeenCalled();
        });

        it('should return null for null id', async () => {
            const result = await findBook(null);
            expect(result).toBeNull();
            expect(db.book.findUnique).not.toHaveBeenCalled();
        });
    });

    describe('createBook', () => {
        it('should create a book with valid data', async () => {
            const bookData = {
                title: 'New Book',
                author: 'Author Name',
                published: '2023-01-01',
                summary: 'Book summary',
            };

            await createBook(bookData);
            expect(db.book.create).toHaveBeenCalledWith({
                data: {
                    ...bookData,
                    published: new Date(bookData.published),
                },
            });
        });

        it('should throw an error for invalid book data', async () => {
            const invalidBookData = {
                title: 'Invalid Book',
                // Missing required fields
            };

            await expect(createBook(invalidBookData)).rejects.toThrow('Invalid book body');
            expect(db.book.create).not.toHaveBeenCalled();
        });
    });

    describe('checkBookExists', () => {
        it('should check if a book exists by id', async () => {
            vi.mocked(db.book.findUnique).mockResolvedValue({ id: 1, title: 'Existing Book' });

            const result = await checkBookExists({ id: 1 });
            expect(result).toBe(true);
            expect(db.book.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('should check if a book exists by book body', async () => {
            const bookBody = {
                title: 'Existing Book',
                author: 'Author Name',
                published: '2023-01-01',
            };

            vi.mocked(db.book.findFirst).mockResolvedValue({ id: 1, ...bookBody });

            const result = await checkBookExists({ bookBody });
            expect(result).toBe(true);
            expect(db.book.findFirst).toHaveBeenCalledWith({
                where: {
                    title: bookBody.title,
                    published: new Date(bookBody.published),
                    author: bookBody.author,
                },
            });
        });

        it('should return false if book does not exist', async () => {
            vi.mocked(db.book.findUnique).mockResolvedValue(null);

            const result = await checkBookExists({ id: 999 });
            expect(result).toBe(false);
        });
    });

    describe('updateBook', () => {
        it('should update a book with valid data', async () => {
            const bookId = 1;
            const bookData = {
                title: 'Updated Book',
                author: 'Updated Author',
                published: '2023-02-01',
                summary: 'Updated summary',
            };

            await updateBook(bookId, bookData);
            expect(db.book.update).toHaveBeenCalledWith({
                where: { id: bookId },
                data: {
                    ...bookData,
                    published: new Date(bookData.published),
                },
            });
        });

        it('should update a book with partial data', async () => {
            const bookId = 1;
            const bookData = {
                title: 'Updated Book',
                // Other fields are missing
            };

            await updateBook(bookId, bookData);
            expect(db.book.update).toHaveBeenCalledWith({
                where: { id: bookId },
                data: {
                    title: bookData.title,
                    published: undefined,
                    author: undefined,
                    summary: undefined,
                },
            });
        });
    });
});