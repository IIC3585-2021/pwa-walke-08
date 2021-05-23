const container = document.querySelector(".container")
const coffees = [
  { name: "Perspiciatis", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee1.jpg" },
  { name: "Voluptatem", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee2.jpg" },
  { name: "Explicabo", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee3.jpg" },
  { name: "Rchitecto", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee4.jpg" },
  { name: " Beatae", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee5.jpg" },
  { name: " Vitae", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee6.jpg" },
  { name: "Inventore", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee7.jpg" },
  { name: "Veritatis", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee8.jpg" },
  { name: "Accusantium", image: "https://raw.githubusercontent.com/ibrahima92/pwa-with-vanilla-js/master/images/coffee9.jpg" },
]

const showCoffees = () => {
  let output = ""
  coffees.forEach(
    ({ name, image }) =>
      (output += `
              <div class="card">
                <img class="card--avatar" src=${image} />
                <h1 class="card--title">${name}</h1>
                <a class="card--link" href="#">Taste</a>
              </div>
              `)
  )
  container.innerHTML = output
}

document.addEventListener("DOMContentLoaded", showCoffees)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}


const formulario = document.getElementById("formulario")

function postear(e) {
  e.preventDefault();
  fetch("https://twitter-pwa-54709-default-rtdb.firebaseio.com/posts.json", {
    method: 'POST',
    body: JSON.stringify({
        comentario: document.getElementById("comentario").value,
        fecha: new Date(),
        usuario: document.getElementById("nickname").value
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      document.getElementById("comentario").value = "";
      document.getElementById("nickname").value = "";
      console.log(data);
    })
} 

function htmlTags(data){
  const comentarios = document.getElementById('comentarios');
  let temp = document.getElementsByTagName("template")[0];
  let clon = temp.content.cloneNode(true);
  const respuestas = clon.getElementById("respuestas");
  clon.querySelector(".profile-link").innerHTML = data.usuario;
  clon.querySelector(".text-muted").innerHTML = data.fecha;
  clon.querySelector(".opinion").innerHTML = data.comentario;
  let n = 1;
  console.log("data: ", data)
  while (`respuesta${n}` in data) {
    console.log('entro')
    let temp1 = document.getElementsByTagName("template")[1];
    let clonado = temp1.content.cloneNode(true);
    clonado.querySelector(".profile-link").innerHTML = data[`respuesta${n}`].usuario
    clonado.querySelector("p").innerHTML += data[`respuesta${n}`].comentario
    respuestas.appendChild(clonado); 
    n++;
  }

  clon.querySelector(".comentar").addEventListener("submit", e => {
    e.preventDefault();
    fetch("https://twitter-pwa-54709-default-rtdb.firebaseio.com/posts.json", {
      method: 'PUT',
      body: JSON.stringify({
          comentario: document.getElementById("comentario").value,
          fecha: new Date(),
          usuario: document.getElementById("nickname").value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  });
  comentarios.appendChild(clon);
}


fetch("https://twitter-pwa-54709-default-rtdb.firebaseio.com/posts.json")
    .then(response => response.json())
    .then(data => {
      console.log(data)
      for (let key in data) {
        console.log(data[key], 'dfsdf')
        htmlTags(data[key]);
      };
    })

formulario.addEventListener("submit", postear)
