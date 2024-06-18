const { log } = require("console");
const express = require("express");
const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
const config = require("./config/config.json");

const path = require("path");
const app = express();
const port = 5000;

// Static assets access
app.use("/assests", express.static(path.join(__dirname, "src/assests")));

// Middleware parsing body untuk request POST
app.use(express.urlencoded({ extended: true }));

// View engine configuration and views location
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

// Sequelize setup
const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
});

// Verifikasi koneksi
sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

// Definisi model menggunakan Sequelize
const projek = sequelize.define('projek', {
  title: DataTypes.STRING,
  content: DataTypes.TEXT,
  startDate: DataTypes.DATEONLY,
  endDate: DataTypes.DATEONLY,
  nodeJS: DataTypes.BOOLEAN,
  reactJS: DataTypes.BOOLEAN,
  nextJS: DataTypes.BOOLEAN,
  typeScript: DataTypes.BOOLEAN,
  startYear: DataTypes.INTEGER, // Menambahkan kolom startYear
  durationDays: DataTypes.INTEGER // Menambahkan kolom durationDays
});

// Routes
app.get("/", async (req, res) => {
  const projects = await projek.findAll();
  res.render("index", { projects });
});

app.get("/add-projek", (req, res) => {
  res.render("add-projek");
});

app.post("/add-projek", async (req, res) => {
  const { title, content, startDate, endDate, nodeJS, reactJS, nextJS, typeScript } = req.body;
  
  // Menghitung startYear
  const start = new Date(startDate);
  const startYear = start.getFullYear();

  // Menghitung durationDays
  const end = new Date(endDate);
  const durationMs = end - start; // durasi dalam milidetik
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24)); // Konversi milidetik ke hari

  await projek.create({
    title,
    content,
    startDate,
    endDate,
    nodeJS: nodeJS === "on",
    reactJS: reactJS === "on",
    nextJS: nextJS === "on",
    typeScript: typeScript === "on",
    startYear, // Menambahkan startYear ke database
    durationDays // Menambahkan durationDays ke database
  });
  res.redirect("/");
});

app.get("/detail-projek/:id", async (req, res) => {
  const project = await projek.findByPk(req.params.id);
  if (project) {
    res.render("detail-projek", { project });
  } else {
    res.status(404).send("Projek tidak ditemukan");
  }
});

app.get("/testimonial", (req, res) => {
  res.render("testimonial");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

app.get("/update-projek/:id", async (req, res) => {
  const project = await projek.findByPk(req.params.id);
  if (project) {
    res.render("update-projek", { project });
  } else {
    res.status(404).send("Projek tidak ditemukan");
  }
});

app.post("/update-projek/:id", async (req, res) => {
  const { title, content, startDate, endDate, nodeJS, reactJS, nextJS, typeScript } = req.body;
  await projek.update({
    title,
    content,
    startDate,
    endDate,
    nodeJS: nodeJS === "on",
    reactJS: reactJS === "on",
    nextJS: nextJS === "on",
    typeScript: typeScript === "on"
  }, {
    where: { id: req.params.id }
  });
  res.redirect("/");
});

app.post("/delete-projek/:id", async (req, res) => {
  await projek.destroy({
    where: { id: req.params.id }
  });
  res.redirect("/");
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
