let dataBlog = [];

function submitBlog(event) {
  event.preventDefault();

  let title = document.getElementById("inputTitle").value;
  let startdate = document.getElementById("startDate").value;
  let enddate = document.getElementById("endDate").value;
  let content = document.getElementById("inputContent").value;
  let nodeJS = document.getElementById("nodeJS").checked;
  let reactJS = document.getElementById("reactJS").checked;
  let nextJS = document.getElementById("nextJS").checked;
  let typeScript = document.getElementById("typeScript").checked;
  let image = document.getElementById("inputImage").files[0];

  if (title === "") {
    return alert("Input Title");
  } else if (content === "") {
    return alert("Input Content");
  } else if (!nodeJS && !reactJS && !nextJS && !typeScript) {
    return alert("harus di pilih!");
  } else if (!image) {
    return alert("Upload Image");
  }

  if (new Date(enddate) < new Date(startdate)) {
    return alert(
      "masukan waktu yang benar"
    );
  }

  let imageURL = URL.createObjectURL(image);

  dataBlog.push({
    title: title,
    startdate: startdate,
    enddate: enddate,
    content: content,
    image: imageURL,
    technologies: {
      nodeJS: nodeJS,
      reactJS: reactJS,
      nextJS: nextJS,
      typeScript: typeScript,
    },
    duration: calculateDuration(startdate, enddate),
  });

  console.log(dataBlog);

  renderBlog();
}

function calculateDuration(startdate, enddate) {
  let startDate = new Date(startdate);
  let endDate = new Date(enddate);
  let duration = endDate - startDate;
  let days = Math.floor(duration / (1000 * 60 * 60 * 24));
  return `${days} days`;
}

let countdownInterval;

function startBackwardTimer() {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);
  const output = document.getElementById("countdown");

  if (isNaN(startDate) || isNaN(endDate)) {
    output.textContent = "Please enter both start date and end date.";
    return;
  }

  if (startDate > endDate) {
    output.textContent = "Start date cannot be after end date.";
    return;
  }

  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  countdownInterval = setInterval(() => {
    const now = new Date();
    let timeRemaining = endDate - now;

    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      output.textContent = "Time is up!";
      return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    document.getElementById("days").textContent = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").textContent = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").textContent = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").textContent = seconds
      .toString()
      .padStart(2, "0");
  }, 1000);
}

function renderBlog() {
  const contentContainer = document.getElementById("content");
  contentContainer.innerHTML = "";
  for (let index = 0; index < dataBlog.length; index++) {
    const project = dataBlog[index];
    contentContainer.innerHTML += `
    <div class="col-md-4  ">
      <div class="card mb-3 shadow">
        <div class="card-body">
          <img src="${
            project.image
          }" alt="image upload" class="img-thumbnail" />
          <h5 class="card-title">${project.title} - ${new Date(
      project.startdate
    ).getFullYear()}</h5>
          <p class="card-text">${project.content}</p>
          <p class="card-text">Durasi: ${project.duration}</p>
          <p class="card-text">${project.content}</p>
          <div class="card-text">
            ${
              project.technologies.nodeJS
                ? '<i class="fa-brands fa-node-js"></i>'
                : ""
            }
            ${
              project.technologies.reactJS
                ? '<i class="fa-brands fa-react"></i>'
                : ""
            }
            ${
              project.technologies.nextJS
                ? '<i class="fa-brands fa-js"></i>'
                : ""
            }
            ${
              project.technologies.typeScript
                ? '<i class="fa-brands fa-vuejs"></i>'
                : ""
            }
          </div>
          <a href="#" class="btn btn-primary me-2">Edit</a>
          <button class="btn btn-danger" onclick="deleteProject(${index})">Hapus</button>
        </div>
      </div>
    </div>`;
  }
}

function deleteProject(index) {
  dataBlog.splice(index, 1);
  renderBlog();
}
