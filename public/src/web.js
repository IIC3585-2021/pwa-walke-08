const formulario = document.getElementById("formulario")

function postear(e) {
  const comment = document.getElementById("comentario").value;
  const user = document.getElementById("nickname").value;
  const date = new Date();
  e.preventDefault();
  fetch("https://us-central1-twitter-pwa-54709.cloudfunctions.net/storePostData", {
    method: 'POST',
    body: JSON.stringify({
        comentario: comment,
        fecha: date,
        usuario: user
    }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      const comentarios = document.getElementById('comentarios');
      let temp = document.getElementsByTagName("template")[0];
      let clon = temp.content.cloneNode(true);
      const respuestas = clon.getElementById("respuestas");
      clon.querySelector(".profile-link").innerHTML = user;
      clon.querySelector(".text-muted").innerHTML = date;
      clon.querySelector(".opinion").innerHTML = comment;
      document.getElementById("comentario").value = "";
      document.getElementById("nickname").value = "";
      console.log(data);
      comentarios.appendChild(clon);
    })
} 

function htmlTags(data, key){
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

  const form = clon.querySelector(".comentar");
  form.id = key;

  const handleSubmit = () => {
    let n_respuesta = n
    return e => {
      e.preventDefault();
      const respuesta = e.target[1].value;
      const nickname = e.target[0].value;
      const fechita = new Date()
      fetch(`https://twitter-pwa-54709-default-rtdb.firebaseio.com/posts/${key}.json`, {
        method: 'PATCH',
        body: JSON.stringify({       
          [`respuesta` + n_respuesta]:{
            comentario: respuesta,
            fecha: fechita,
            usuario: nickname
          }
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(() => {
          console.log('repusta exitosa!');
          n_respuesta++;
        })
        .catch(err => {
          console.log('error al responder', err);
        })
      e.target[1].value = ""
      e.target[0].value = ""
      let temp1 = document.getElementsByTagName("template")[1];
      let clonado = temp1.content.cloneNode(true);
      clonado.querySelector(".profile-link").innerHTML = nickname
      clonado.querySelector("p").innerHTML += respuesta
      respuestas.appendChild(clonado);
    }
  }
  
  form.addEventListener("submit", handleSubmit());
  comentarios.appendChild(clon);
}


fetch("https://twitter-pwa-54709-default-rtdb.firebaseio.com/posts.json")
    .then(response => response.json())
    .then(data => {
      console.log(data)
      for (let key in data) {
        console.log(data[key], 'dfsdf')
        htmlTags(data[key], key);
      };
    })

formulario.addEventListener("submit", postear)
