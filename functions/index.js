const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const serviceAccount = require("./twitter-pwa-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://twitter-pwa-54709-default-rtdb.firebaseio.com/',
})

exports.storePostData = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    admin.database().ref('posts').push({
      comentario: request.body.comentario,
      usuario: request.body.usuario,
      fecha: request.body.fecha
    })
      .then(() => {
        webpush.setVapidDetails('mailto:jpchacon@uc.cl',
          'BFmbPbd5D5gWHm6LeUSHMevuEt5VTA2pnciOdw_SfoDj0n377z-MXIp-tpMYZuMBIQiMenG0b8_mOkz1lsK9K78',
          'lpTi2K-yq21QitVDWFt0ddcAl42MUrVsTogNsUoeAYY'
        );
        return admin.database().ref('subscriptions').once('value');
      })
      .then(subscriptions => {
        subscriptions.forEach(sub => {
          const pushConfig = {
            endpoint: sub.val().endpoint,
            keys: {
              auth: sub.val().keys.auth,
              p256dh: sub.val().keys.p256dh
            }
          }

          webpush.sendNotification(pushConfig, JSON.stringify({title: 'New post', content: 'New post added'}))
            .catch(err => {
              console.log('error to send notification', err);
            })
        })
        response.status(201).json({message: 'Data stored'});
      })
      .catch(err => {
        response.status(500).json({error: err})
      })
  })
});
