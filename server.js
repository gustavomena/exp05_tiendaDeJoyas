
const express = require('express');
const app = express();
const joyas = require('./data/joyas.js');
const route='http://localhost:3000/api/v1/'

app.use(express.static('data'));
app.listen(3000, () => console.log('Server ON port 3000'));


const orderValues = (order) => {
  return order == "asc"
    ? joyas.sort((a, b) => (a.value > b.value ? 1 : -1))
    : order == "desc"
    ? joyas.sort((a, b) => (a.value < b.value ? 1 : -1))
    : false;
};

const HATEOAS = () => joyas.map(joya => ({ name: joya.name, id: joya.id, model:joya.model, category: joya.category, metal: joya.metal, value: joya.value, stock: joya.stock, href: `${route}joya/${joya.id}` }));
app.get('/api/v1/joyas', (req, res) => {
  const { values } = req.query;
  if (values == "asc") return res.send(orderValues("asc"));
  if (values == "desc") return res.send(orderValues("desc"));
  if (req.query.page) {
    const { page } = req.query;
    return res.send({ joyas: HATEOAS().slice(page * 2 - 2, page * 2) });
  }
    res.send({
      joyas: HATEOAS(),
    })
})


const orderCost = (order) => {
  return order == "asc"
    ? joyas.sort((a, b) => (a.value > b.value ? 1 : -1))
    : order == "desc"
    ? joyas.sort((a, b) => (a.value < b.value ? 1 : -1))
    : false;
};

const HATEOASV2 = () =>
  joyas.map((joya) => ({jewel: joya.name,identification: joya.id,ejemplar: joya.model,type: joya.category,material: joya.metal,cost: joya.value,inventario: joya.stock,location: `http://localhost:3000/api/v2/joya/${joya.id}`,
  }));
app.get('/api/v2/joyas', (req, res) => {
  const { cost } = req.query
  if (cost == "asc") return res.send(orderCost("asc"));
  if (cost == "desc") return res.send(orderCost("desc"));
  if (req.query.page) {
    const { page } = req.query
    return res.send({ joyas: HATEOASV2().slice(page * 2 - 2, page * 2) })
  }
    res.send({
      joyas:HATEOASV2(),
    })
})


const filterByCategory = (category) => {
  return joyas.filter(joya=>joya.category === category)
}
app.get('/api/v2/category/:type', (req, res) => {
  const type = req.params.type
  res.send(filterByCategory(type))
})


const filterByName = (name) => {
  return joyas.filter(joya =>joya.name===name)
}
app.get('/api/v2/name/:name', (req,res)=> {
  const name = req.params.name
  res.send(filterByName(name))
})


const joya = (id) => {
  return joyas.find(joya =>joya.id ==id)
}

app.get("/api/v1/joya/:id", (req, res) => {
  const id = req.params.id;
  joya(id)
    ? res.send({ joya: joya(id) })
    : res.status(404).json({
      error: '404 Not Found',
      message: 'ID no existe'
    });
});

app.get('/api/v2/joya/:id', (req, res) => {
  const id = req.params.id;
  //crear una ruta que devuelva como payload un JSON con un mensaje de error cuando el usuario consulte el id de una joya que no exista
  joya(id)
    ? res.send({ joya: joya(id) })
    : res.status(404).json({
        error: "404 Not Found",
        message: "No existe una joya con ese ID",
      });
});

