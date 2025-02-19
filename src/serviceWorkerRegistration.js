export function register() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/service-worker.js')  // Correct path
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.log('Service Worker registration failed:', error);
        });
    }
  }
  