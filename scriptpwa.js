
        let deferredPrompt;
        const installButton = document.getElementById('installButton');

        window.addEventListener('beforeinstallprompt', (e) => {
            // Previene que el navegador muestre automáticamente el prompt
            e.preventDefault();
            // Guarda el evento para poder dispararlo después
            deferredPrompt = e;
            // Muestra el botón de instalación
            installButton.style.display = 'block';
        });

        installButton.addEventListener('click', () => {
            // Oculta el botón
            installButton.style.display = 'none';
            // Muestra el prompt de instalación
            deferredPrompt.prompt();
            // Espera a que el usuario responda al prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('El usuario aceptó la instalación de la PWA');
                } else {
                    console.log('El usuario rechazó la instalación de la PWA');
                }
                deferredPrompt = null; // Limpia el prompt
            });
        });

        // Registro del Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('https://prfol.github.io/demo02/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registrado con éxito:', registration);
                    })
                    .catch(error => {
                        console.error('Fallo el registro del Service Worker:', error);
                    });
            });
        }
