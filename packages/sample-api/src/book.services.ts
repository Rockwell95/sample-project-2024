import { Book } from "@prisma/client";
import { db } from "./db"

/**
 * Find a book by its ID in the database
 * @param bookId The ID of the book being searched for
 * @returns the book matching the requested ID if it exists, null otherwise
 */
export const findBook = async (bookId: number | string | null) => {
    if (bookId) {
        const parsedBookId = typeof bookId === "number" ? bookId : parseInt(bookId);
        if (!isNaN(parsedBookId)) {
            return db.book.findUnique({
                where: {
                    id: parsedBookId
                },
            })
        }
    }
    return null;
}

/**
 * Create a book in the database, and throw an error if the request is invalid (i.e., missing required fields)
 * @param bookBody The details of the book to be created
 */
export const createBook = async (bookBody: { [key: string]: any }) => {
    if (_isValidBookBody(bookBody)) {


        await db.book.create({
            data: {
                published: new Date(bookBody.published),
                title: bookBody.title,
                author: bookBody.author,
                summary: bookBody.summary
            }
        })
    } else {
        throw new Error("Invalid book body")
    }
}

/**
 * Search if a book exists. First, search by its ID if provided, and if no ID is provided, instead search for the book by its title, author, and publication date
 * @param bookBody The body of the book being searched for
 * @param id The ID of the book being searched for 
 * @returns true if the book exists, false if it either does not exist, or the parameters provided are inadequate
 */
export const checkBookExists = async ({ bookBody, id }: { bookBody?: { [key: string]: any }, id?: number }) => {
    let existingBook: Book | null = null;
    if (id)
        existingBook = await db.book.findUnique({
            where: {
                id
            }
        })
    else if (bookBody && _isValidBookBody(bookBody)) {
        existingBook = await db.book.findFirst({
            where: {
                title: bookBody.title,
                published: new Date(bookBody.published),
                author: bookBody.author
            }
        })
    }
    return Boolean(existingBook);
}

/**
 * Update a book by its ID with the provided properties
 * @param bookId The ID of the book to update
 * @param bookBody The body of the book. If a field is undefined, the value in the database is unmodified
 */
export const updateBook = async (bookId: number, bookBody: { [key: string]: any }) => {
    await db.book.update({
        where: { id: bookId },
        data: {
            title: bookBody.title,
            published: bookBody.published ? new Date(bookBody.published) : undefined,
            author: bookBody.author,
            summary: bookBody.summary
        }
    })
}

/**
 * Check if a provided object is valid as a book body (i.e., contains all required fields)
 * @param bookBody The possible book body to check
 * @returns true if the object can be used as a valid book body, false otherwise.
 */
const _isValidBookBody = (bookBody: { [key: string]: any; }): boolean => {
    const isBook = Boolean(bookBody.published && !isNaN(new Date(bookBody.published).getTime()) && bookBody.title && bookBody.author);
    return isBook;
}

