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

async function downloadOutput() {
  const outputText = document.getElementById('output').textContent;
  if (!outputText.trim()) return;
  // For small files, use Blob + createObjectURL directly (avoid SW/setup overhead)
  const smallThreshold = 32 * 1024; // 32KB
  const smallSize = new Blob([outputText]).size;
  if (smallSize <= smallThreshold) {
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
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
    setTimeout(() => URL.revokeObjectURL(url), 200);
    return;
  }

  // For larger files: 1) Try File System Access API (fastest on HTTPS),
  // 2) then StreamSaver, 3) then Blob fallback
  try {
    if (window.showSaveFilePicker) {
      const opts = {
        suggestedName: 'testo_pulito.txt',
        types: [{
          description: 'Text file',
          accept: { 'text/plain': ['.txt'] }
        }]
      };
      const handle = await window.showSaveFilePicker(opts);
      const writable = await handle.createWritable();
      await writable.write(outputText);
      await writable.close();
      return;
    }
  } catch (e) {
    console.warn('showSaveFilePicker failed, falling back', e);
  }

  try {
    if (window.streamSaver && streamSaver.createWriteStream && (typeof WritableStream !== 'undefined')) {
      const fileStream = streamSaver.createWriteStream('testo_pulito.txt');
      const writer = fileStream.getWriter();
      const encoder = new TextEncoder();
      const chunkSize = 64 * 1024; // 64KB
      for (let i = 0; i < outputText.length; i += chunkSize) {
        const chunk = outputText.slice(i, i + chunkSize);
        await writer.write(encoder.encode(chunk));
      }
      await writer.close();
      return;
    }
  } catch (e) {
    console.warn('StreamSaver failed, falling back to blob download', e);
  }

  // Final fallback (should be rare for large files)
  const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
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
  setTimeout(() => URL.revokeObjectURL(url), 200);
}

