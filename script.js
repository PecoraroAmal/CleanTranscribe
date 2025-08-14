function pulisciTesto() {
  const input = document.getElementById('inputText').value;

  if (!input.trim()) return;

  // Rimuove timestamp tipo 0:05, 12:34 ecc.
  let testo = input.replace(/\b\d{1,2}:\d{2}\b/g, '');

  // Rimuove newline e spazi multipli
  testo = testo.replace(/\n+/g, ' ').replace(/\s{2,}/g, ' ').trim();

  const outputEl = document.getElementById('output');
  outputEl.textContent = testo;

  // Mostra l'output e il bottone copia
  document.getElementById('outputContainer').style.display = 'block';
}

function copiaOutput() {
  const outputText = document.getElementById('output').textContent;
  navigator.clipboard.writeText(outputText)
    .then(() => alert('Testo copiato!'))
    .catch(err => alert('Errore nella copia: ' + err));
}
