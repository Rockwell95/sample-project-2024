import express, { RequestHandler } from "express";
import { db } from "./db";
import { authRouter } from "./auth.routes"
import { isAuthenticated } from "./middlewares";
import { checkBookExists as bookExists, createBook, findBook } from "./book.services";

const app = express()
const port = 3000
app.use(express.json())
app.use("/auth", authRouter)

app.get('/books', isAuthenticated as RequestHandler, async (req, res) => {
    const books = await db.book.findMany();
    console.log(books)
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
        if (await bookExists(req.body)) {
            res.sendStatus(304);
            return;
        }

        await createBook(req.body);
        res.sendStatus(201);
    } catch (error) {
        console.error(error);
        res.status(400).send("Invalid book definition")
    }

})

app.put("/book/:id", isAuthenticated as RequestHandler, async (req, res) => {
    // TODO
    res.sendStatus(501)
})

async function main() {
    // ... you will write your Prisma Client queries here
    console.log("Hello")
    const post = await db.book.findMany();
    console.log(post)

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