import express, { RequestHandler } from "express";
import { db } from "./db";
import { authRouter } from "./auth.routes"
import { isAuthenticated } from "./middlewares";
import { checkBookExists, createBook, findBook, updateBook } from "./book.services";

const app = express()
const port = 3000
app.use(express.json())
app.use("/auth", authRouter)

app.get('/books', isAuthenticated as RequestHandler, async (req, res) => {
    const books = await db.book.findMany();
    res.send(books);
})

app.get('/book/:id', isAuthenticated as RequestHandler, async (req, res) => {
    const book = await findBook(req.params.id);

    if (book) {
        res.send(book)
    }
    else {
        res.sendStatus(404)
    }
})

app.post("/book", isAuthenticated as RequestHandler, async (req, res) => {
    try {
        if (await checkBookExists({ bookBody: req.body })) {
            return res.sendStatus(304);
        }

        await createBook(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid book definition")
    }

})

app.put("/book/:id", isAuthenticated as RequestHandler, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            throw new Error("Invalid book ID")
        }
        if (await checkBookExists({ id })) {
            await updateBook(id, req.body);
            return res.sendStatus(200)
        }
        return res.sendStatus(404);
    } catch (error) {
        console.error("Error updating book", error);
        res.status(400).send(error)
    }
})

async function main() {
    app.listen(port, () => {
        console.log(`Book API listening on port ${port}`)
    })

}

main()
    .then(async () => {
        await db.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await db.$disconnect()
        process.exit(1)
    })