import express from "express";
import pg from "pg";
import axios from "axios";
import bodyParser from "body-parser";
import 'dotenv/config';

const app = express();
const port = 3000;

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: process.env.PASSWORD,
    port: 5432,
});
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

async function getCover(book) {
    const result = await axios.get(`https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`)
    return result.config.url;
}

app.get("/", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM books");
        const result = response.rows;
        const books = [];
    
        // Utilizando for...of para aguardar cada operação assíncrona
        for (const book of result) {
            const bookCover = await getCover(book);
            book.src = bookCover;
            books.push(book);
        }
    
        res.render("index.ejs", { books });
    } catch (error) {
        console.error(error); // Lidar com erros de forma adequada e enviar uma resposta de erro para o cliente.
    }
});

app.get("/rating", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM BOOKS ORDER BY rating DESC;");
        const result = response.rows;
        const books = [];
    
        // Utilizando for...of para aguardar cada operação assíncrona
        for (const book of result) {
            const bookCover = await getCover(book);
            book.src = bookCover;
            books.push(book);
        }
    
        res.render("index.ejs", { books });
    } catch (error) {
        console.error(error); // Lidar com erros de forma adequada e enviar uma resposta de erro para o cliente.
    }
})

app.get("/title", async (req, res) => {
    try {
        const response = await db.query("SELECT * FROM BOOKS ORDER BY title;");
        const result = response.rows;
        const books = [];
    
        // Utilizando for...of para aguardar cada operação assíncrona
        for (const book of result) {
            const bookCover = await getCover(book);
            book.src = bookCover;
            books.push(book);
        }
    
        res.render("index.ejs", { books });
    } catch (error) {
        console.error(error); // Lidar com erros de forma adequada e enviar uma resposta de erro para o cliente.
    }
})

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

export default app;