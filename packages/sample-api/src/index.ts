import express, { RequestHandler } from "express";
import { db } from "./db";
import { authRouter } from "./auth.routes"
import { isAuthenticated } from "./middlewares";
import { checkBookExists, createBook, findBook, updateBook } from "./book.services";
import bcrypt from "bcryptjs";
import crypto from "node:crypto"

const app = express()
const port = 3000
app.use(express.json())
app.use("/auth", authRouter)


// Workaround for bcryptjs being unable to find the crypto library after being bundled with rollup.js
// Simply explicitly imports crypto and sets the fallback to the crypto randomBytes function (as implemented in the source for bcrypt.js)
bcrypt.setRandomFallback((random) => Array.from(crypto.randomBytes(random)))

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