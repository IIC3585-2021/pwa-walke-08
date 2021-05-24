if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}

function displayConfirmNotification() {
  if('serviceWorker' in navigator){
    const options = {
      body: 'You subscribe to our notification service!',
    };

    navigator.serviceWorker.ready
      .then(swreg => {
        swreg.showNotification('Successfully subscribe!', options);
      });
  }
}

function configurePushSub() {
  let reg;
  navigator.serviceWorker.ready
    .then(swreg => {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(sub => {
      if(sub === null) {
        console.log('es null')
        // Create new subscription
        const vapidPublicKey = "BFmbPbd5D5gWHm6LeUSHMevuEt5VTA2pnciOdw_SfoDj0n377z-MXIp-tpMYZuMBIQiMenG0b8_mOkz1lsK9K78"
        const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      } else {
        // We have a subscription
      }
    })
    .then(newSub => {
      return fetch('https://twitter-pwa-54709-default-rtdb.firebaseio.com/subscriptions.json', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(newSub)
      })
    })
    .then(res => {
      if (res.ok){
        displayConfirmNotification()
      }
    })
    .catch(err => {
      console.log('SOME ERROR:', err);
    })
}

function askForPermission(event) {
  Notification.requestPermission(result => {
    console.log('user choice', result);
    if (result !== 'granted') {
      console.log('no permission granted!');
    } else {
      console.log('aqui');
      configurePushSub();
    }
  });
}

const enableNotificationButton = document.getElementById('notification-button');

enableNotificationButton.addEventListener('click', askForPermission);

function urlBase64ToUint8Array(base64String) {
  let padding = '='.repeat((4 - base64String.length % 4) % 4);
  let base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  let rawData = window.atob(base64);
  let outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
