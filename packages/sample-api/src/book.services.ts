import { Book } from "@prisma/client";
import { db } from "./db"

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

export const createBook = async (bookBody: { [key: string]: any }) => {
    if (_isValidBookRequest(bookBody)) {


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

export const checkBookExists = async ({ bookBody, id }: { bookBody?: { [key: string]: any }, id?: number }) => {
    let existingBook: Book | null = null;
    if (id)
        existingBook = await db.book.findUnique({
            where: {
                id
            }
        })
    else if (bookBody && _isValidBookRequest(bookBody)) {
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

const _isValidBookRequest = (bookBody: { [key: string]: any; }): boolean => {
    const isBook = Boolean(bookBody.published && !isNaN(new Date(bookBody.published).getTime()) && bookBody.title && bookBody.author);
    return isBook;
}

