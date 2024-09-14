import { PrismaClient } from '@prisma/client'
import express from "express";

const prisma = new PrismaClient()

const app = express()
const port = 3000

app.get('/books', (req, res) => {
  res.send('Hello World!')
})

app.get('/book/:id', (req, res) => {
  res.send('Hello World!')
})

app.post("/book")

async function main() {
  // ... you will write your Prisma Client queries here
  console.log("Hello")
  const post = await prisma.book.findMany();
  console.log(post)
  
  app.listen(port, () => {
    console.log(`Book API listening on port ${port}`)
  })

}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })