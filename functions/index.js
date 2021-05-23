const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { ref } = require("firebase-functions/lib/providers/database");
const cors = require("cors")({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storePostData = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('posts').push({
      comentario: request.body.comentario,
      usuario: request.body.usuario,
      fecha: request.body.fecha
    })
      .then(() => {
        response.status(201).json({message: 'Data stored'});
      })
      .catch(err => {
        response.status(500).json({error: err})
      })
  })
});

// https://us-central1-twitter-pwa-54709.cloudfunctions.net/storePostData
