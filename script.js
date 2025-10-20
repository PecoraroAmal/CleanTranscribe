function pulisciTesto() {
  const input = document.getElementById('inputText').value;
  if (!input.trim()) return;

  // Rimuove timestamp tipo 0:05, 12:34, 1:23:34 ecc.
  let testo = input.replace(/\b\d{1,2}:\d{2}(:\d{2})?\b/g, '');

  // Rimuove newline e spazi multipli
  testo = testo.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();

  // Mostra output
  document.getElementById('output').textContent = testo;
  document.getElementById('outputContainer').style.display = 'block';
}

function copiaOutput() {
  const outputText = document.getElementById('output').textContent;
  const copyButton = document.getElementById('copyButton');

  // Copia il testo
  navigator.clipboard.writeText(outputText).then(() => {
    // Cambia il testo del pulsante
    const originalText = copyButton.textContent;
    copyButton.textContent = '✅ Copiato!';

    // Dopo 5 secondi torna al testo originale
    setTimeout(() => {
      copyButton.textContent = originalText;
    }, 2000);
  });
}

