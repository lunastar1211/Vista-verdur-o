const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_vv"
});

db.getConnection((err) => {
    if(err){
        console.log("Erro ao conectar:", err);
    } else {
        console.log("Banco conectado!");
    }
});

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

app.listen(3001, () => {
    console.log("Servidor rodando na porta 3001");
});