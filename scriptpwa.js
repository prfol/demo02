        let deferredPrompt;
        const installButton = document.getElementById('installButton');

        window.addEventListener('beforeinstallprompt', (e) => {
            // Previene que el mini-infobar aparezca automáticamente
            e.preventDefault();
            // Guarda el evento para que se pueda disparar más tarde.
            deferredPrompt = e;
            // Muestra el botón de instalación
            installButton.style.display = 'block';
        });

        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Oculta el botón de instalación
                installButton.style.display = 'none';
                // Muestra el prompt de instalación
                deferredPrompt.prompt();
                // Espera a que el usuario responda al prompt
                const { outcome } = await deferredPrompt.userChoice;
                // Opcionalmente, registra el resultado
                console.log(`El usuario respondió al prompt de instalación: ${outcome}`);
                // Resetea el evento diferido, ya que solo se puede usar una vez
                deferredPrompt = null;
            }
        });

        // Registrar el Service Worker
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('https://prfol.github.io/demo02/service-worker.js')
                    .then(registration => {
                        console.log('Service Worker registrado con éxito:', registration);
                    })
                    .catch(error => {
                        console.log('Fallo el registro del Service Worker:', error);
                    });
            });
        }
