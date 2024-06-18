const { log } = require("console");
const express = require("express");
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

// Blog entries storage
let blogData = [];

// Routes
app.get("/", (req, res) => {
  res.render("index", { blogData: blogData });
});

app.get("/add-projek", (req, res) => {
  res.render("add-projek");
});

app.post("/add-projek", (req, res) => {
  const {
    title,
    content,
    startDate,
    endDate,
    nodeJS,
    reactJS,
    nextJS,
    typeScript,
  } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startYear = start.getFullYear(); // Mengambil tahun dari startDate

  // Menghitung durasi dalam hari
  const durationMs = end - start; // durasi dalam milidetik
  const durationDays = Math.floor(durationMs / (1000 * 60 * 60 * 24)); // Konversi milidetik ke hari

  // Format tanggal untuk hanya menampilkan tanggal, bulan, dan tahun
  const formattedStartDate = start.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = end.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const newEntry = {
    id: blogData.length, // Menetapkan ID berdasarkan panjang array saat ini
    title,
    content,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    durationDays,
    startYear,
    technologies: {
      nodeJS: nodeJS === "on",
      reactJS: reactJS === "on",
      nextJS: nextJS === "on",
      typeScript: typeScript === "on",
    },
  };
  blogData.unshift(newEntry);
  console.log(newEntry);
  res.redirect("/");
});

app.get("/detail-projek/:id", (req, res) => {
  const { id } = req.params;
  const detail = blogData[id];
  res.render("detail-projek", { detail });
});

app.get("/testimonial", (req, res) => {
  res.render("testimonial");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// Menambahkan rute untuk editprojekView
app.get("/update-projek/:id", editprojekView);

function editprojekView(req, res) {
  const { id } = req.params;
  const datafilter = blogData[parseInt(id)];
  if (datafilter) {
    datafilter.id = parseInt(id);
    console.log(datafilter); // Tambahkan ini untuk memeriksa data yang dikirim
    res.render("update-projek", { detail: datafilter }); // Ubah 'data' menjadi 'detail'
  } else {
    res.status(404).send("Projek tidak ditemukan");
  }
}

app.post("/update-projek/:id", updateProjek);

function updateProjek(req, res) {
  const {
    title,
    content,
    startDate,
    endDate,
    nodeJS,
    reactJS,
    nextJS,
    typeScript,
    id,
  } = req.body;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const formattedStartDate = start.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedEndDate = end.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  blogData[parseInt(id)] = {
    id: parseInt(id), // Menyimpan ID yang sudah ada
    title,
    content,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
    technologies: {
      nodeJS: nodeJS === "on",
      reactJS: reactJS === "on",
      nextJS: nextJS === "on",
      typeScript: typeScript === "on",
    },
  };
  res.redirect("/");
}

app.post("/delete-projek/:id", deleteProjek); // Menggunakan POST daripada DELETE

function deleteProjek(req, res) {
  const { id } = req.params;
  console.log("data sebelum:", blogData);
  blogData.splice(parseInt(id), 1);
  console.log("data sesudah:", blogData);
  res.redirect("/");
}

// Menjalankan server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
