const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRequest(request, response, next) {
  const {id} = request.params;
  const find = repositories.find(repository => repository.id === id);
  if (!find) {
    return response.status(400).json({error: "Repository not Found"});
  };
  return next();

};

app.use("/repositories/:id", validateRequest);

app.get("/repositories", (request, response) => {
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {title, url, techs } = request.body;
  const {id} = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  repositories[index] = {...repositories[index], title, url, techs}

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  const index = repositories.findIndex(repository => repository.id === id);

  const {likes} = repositories[index];
  repositories[index] = {...repositories[index], likes:likes+1 };

  return response.json(repositories[index]);
});

module.exports = app;
