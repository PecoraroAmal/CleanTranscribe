function cleanText() {
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

function copyOutput() {
  const outputText = document.getElementById('output').textContent;
  const copyButton = document.getElementById('copyButton');

  // Copia il testo
  navigator.clipboard.writeText(outputText).then(() => {
    // Cambia l'icona
    const icon = copyButton.querySelector('i');
    icon.className = 'fas fa-check';

    // Dopo 2 secondi torna all'icona originale
    setTimeout(() => {
      icon.className = 'fas fa-clipboard';
    }, 2000);
  });
}

function downloadOutput() {
  const outputText = document.getElementById('output').textContent;
  if (!outputText.trim()) return;
  const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });

  // IE / Edge fallback
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(blob, 'testo_pulito.txt');
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'testo_pulito.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Revoca l'URL dopo un breve ritardo per garantire che il download parta
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

