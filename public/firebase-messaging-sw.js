importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js"
  );
  
  importScripts(
    "https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js"
  );
  
  firebase.initializeApp({
  
    apiKey: "AIzaSyBJLeACHmH8B94QJvCAtoy3rZnorbwffjo",
  
    authDomain:
      "grababite-8cead.firebaseapp.com",
  
    projectId:
      "grababite-8cead",
  
    storageBucket:
      "grababite-8cead.firebasestorage.app",
  
    messagingSenderId:
      "312531404065",
  
    appId:
      "1:312531404065:web:95ec8a60d2067ac5d2aa60",
  });
  
  const messaging =
    firebase.messaging();
  
  messaging.onBackgroundMessage(
    (payload) => {
  
      self.registration.showNotification(
        payload.notification.title,
        {
          body:
            payload.notification.body,
        }
      );
    }
  );