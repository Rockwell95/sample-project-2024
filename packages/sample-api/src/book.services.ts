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
    if (isValidBookRequest(bookBody)) {


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

export const checkBookExists = async (bookBody: { [key: string]: any }) => {
    if (isValidBookRequest(bookBody)) {
        const existingBook = await db.book.findFirst({
            where: {
                title: bookBody.title,
                published: new Date(bookBody.published),
                author: bookBody.author
            }
        })
        return Boolean(existingBook);
    }
    return false;
}

const isValidBookRequest = (bookBody: { [key: string]: any; }): boolean => {
    const isBook = Boolean(bookBody.published && !isNaN(new Date(bookBody.published).getTime()) && bookBody.title && bookBody.author);
    return isBook;
}

