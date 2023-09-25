const express = require("express");
const app = express();
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database

connection
  .authenticate()
  .then(() => console.log("Conectado com sucesso!"))
  .catch((erro) => console.log(erro));

/// Body Parser

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/// Template Engine

app.set("view engine", "ejs");

// Middleware para acessar os arquivos estáticos da pasta public
app.use(express.static("public"));

// Rotas

app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true, order: [["id", "DESC"]] }).then((perguntas) => {
    res.render("index.ejs", {
      perguntas: perguntas,
    });
  });
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar");
});

app.post("/salvapergunta", (req, res) => {
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao,
  }).then(() => res.redirect("/"));
});

app.get("/pergunta/:id", (req, res) => {
  const id = req.params.id;

  Pergunta.findOne({ where: { id: id } }).then((pergunta) => {
    if (pergunta != undefined) {
      /// Pergunta encontada
      Resposta.findAll({
        raw: true,
        order: [["id", "DESC"]],
        where: { perguntaId: pergunta.id },
      }).then((resposta) => {
        res.render("pergunta", {
          pergunta: pergunta,
          resposta: resposta,
        });
      });
    } else {
      /// Pergunta não encontrada manda para a rota princiapal
      res.redirect("/");
    };
  });
});

app.post("/responder", (req, res) => {
  const corpo = req.body.corpo;
  const perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId,
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen("3000", (erro) =>
  erro ? console.log(erro) : console.log("Servido rodando...")
);
