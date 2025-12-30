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

// Variabili per tenere il file temporaneo creato nel browser
let pendingCleanedText = null;
let pendingBlobURL = null;

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

async function downloadOutput() {
  // Prefer usare il testo già creato da `cleanText()` se presente
  let outputText = pendingCleanedText;
  if (!outputText) {
    outputText = document.getElementById('output').textContent;
  }
  if (!outputText || !outputText.trim()) return;
  // Se il testo è stato creato con `cleanText`, usiamo il Blob già pronto
  if (!pendingBlobURL) {
    // Crea Blob senza alterare il contenuto
    const blob = new Blob([outputText], { type: 'text/plain' });
    pendingBlobURL = URL.createObjectURL(blob);
    pendingCleanedText = outputText;
  }

  // Try File System Access API when available (user gesture from click)
  if (window.showSaveFilePicker) {
    try {
      const opts = {
        suggestedName: 'testo_pulito.txt',
        types: [{ description: 'Text file', accept: { 'text/plain': ['.txt'] } }]
      };
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
      // Scrive esattamente il testo senza trasformazioni
      await writable.write(pendingCleanedText || outputText);
      await writable.close();
      // Salvataggio completato correttamente: pulisci risorse
      if (pendingBlobURL) {
        URL.revokeObjectURL(pendingBlobURL);
        pendingBlobURL = null;
      }
      pendingCleanedText = null;
      return;
    } catch (e) {
      console.warn('showSaveFilePicker failed or was cancelled', e);
      // continua con fallback
    }
  }

  // Fallback: for browsers without File System Access, apri il download dal Blob URL
  try {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = pendingBlobURL;
    a.download = 'testo_pulito.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Non possiamo rilevare con certezza il successo del salvataggio in questo caso,
    // ma rimuoviamo l'URL dopo un breve ritardo per liberare risorse
    setTimeout(() => {
      if (pendingBlobURL) {
        URL.revokeObjectURL(pendingBlobURL);
        pendingBlobURL = null;
      }
      pendingCleanedText = null;
    }, 500);
  } catch (e) {
    console.error('Download fallback failed', e);
  }
}

