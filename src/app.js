const path = require(`path`);
const express = require("express");
const hbs = require(`hbs`);
const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");
const app = express();

// Define paths for Express Config
const publicDirPath = path.join(__dirname, `../public`);
const viewsPath = path.join(__dirname, `../templates/views`);
const partialsPath = path.join(__dirname, `../templates/partials`);

//Set up Handlebars and views
app.set(`view engine`, `hbs`);
app.set(`views`, viewsPath);
hbs.registerPartials(partialsPath);

//setup Static directory
app.use(express.static(publicDirPath));

app.get(``, (req, res) => {
  res.render(`index`, {
    title: `Weather App`,
    name: `Forrest Salisbury`,
  });
});
app.get(`/about`, (req, res) => {
  res.render(`about`, {
    title: `About me`,
    name: `Forrest Salisbury`,
  });
});

app.get(`/help`, (req, res) => {
  res.render(`help`, {
    helpText: `This is some helpful text`,
    title: `Help`,
    name: `Forrest Salisbury`,
  });
});

app.get(`/help`, (req, res) => {
  res.send([
    {
      name: `Andrew`,
      age: 27,
    },
    {
      name: `Sarah`,
    },
  ]);
});

app.get(`/about`, (req, res) => {
  res.send(`<h1>About Page</h1>`);
});

app.get(`/weather`, (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: `You must provide a Address`,
    });
  }

  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      if (error) {
        return res.send({ error });
      }

      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error });
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        });
      });
    }
  );
});

app.get(`/products`, (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: `Must provide search term`,
    });
  }
  console.log(req.query);
  res.send({
    products: [],
  });
});

app.get(`/help/*`, (req, res) => {
  res.render(`404`, {
    title: `404`,
    name: `Forrest Salisbury`,
    errorMessage: `Help article not found`,
  });
});

app.get(`*`, (req, res) => {
  res.render(`404`, {
    title: `404`,
    name: `Forrest Salisbury`,
    errorMessage: `Page not found`,
  });
});

app.listen(3000, () => {
  console.log(`Server is up on port 3000`);
});
