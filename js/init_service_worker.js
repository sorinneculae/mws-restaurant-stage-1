window.addEventListener('load', () => initSW());

initSW = () => {
  if (!navigator.serviceWorker) return;

  navigator.serviceWorker.register('/sw.js').then( () => {
    console.log('SW is working!');
  }).catch( () => {
    console.log('SW reg failed!');
  });
}