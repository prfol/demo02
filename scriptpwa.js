let deferredPrompt;
const installButton = document.getElementById('installButton');

// 1. Registro del Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration);
      })
      .catch(error => {
        console.error('Fallo el registro del Service Worker:', error);
      });
  });
}

// 2. Captura del evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', (event) => {
  // Previene que el navegador muestre automáticamente el prompt de instalación
  event.preventDefault();
  // Guarda el evento para usarlo más tarde
  deferredPrompt = event;
  // Muestra el botón de instalación (si estaba oculto)
  installButton.style.display = 'block';
  console.log('El evento beforeinstallprompt ha sido disparado.');
});

// 3. Manejo del clic en el botón de instalación
installButton.addEventListener('click', () => {
  if (deferredPrompt) {
    // Muestra el prompt de instalación del navegador
    deferredPrompt.prompt();
    // Espera a que el usuario responda al prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuario aceptó la instalación de la PWA');
      } else {
        console.log('Usuario rechazó la instalación de la PWA');
      }
      // Limpia el deferredPrompt
      deferredPrompt = null;
    });
  }
});