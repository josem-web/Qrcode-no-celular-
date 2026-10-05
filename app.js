const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');
const previewBox = document.getElementById('previewBox');
const resultBox = document.getElementById('resultBox');
const resultText = document.getElementById('resultText');
const resultLink = document.getElementById('resultLink');
const status = document.getElementById('status');
const copyBtn = document.getElementById('copyBtn');

const html5QrCode = new Html5Qrcode("previewBox");

fileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if(!file) return;

  preview.src = URL.createObjectURL(file);
  previewBox.hidden = false;
  resultBox.hidden = true;
  status.textContent = 'Lendo QR Code...';

  try {
    // Essa função lê QR direto da imagem, sem câmera
    const decodedText = await html5QrCode.scanFile(file, false);

    resultBox.hidden = false;
    resultText.textContent = decodedText;
    status.textContent = '✅ QR encontrado!';

    // Se for link, mostra botão
    if(decodedText.startsWith('http')){
      resultLink.href = decodedText;
      resultLink.textContent = 'Abrir: ' + decodedText;
      resultLink.hidden = false;
    } else {
      resultLink.hidden = true;
    }

  } catch(err){
    status.textContent = '❌ Nenhum QR Code encontrado nessa imagem. Tente outra foto mais nítida.';
    resultBox.hidden = true;
  }
});

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(resultText.textContent);
  copyBtn.textContent = 'Copiado!';
  setTimeout(()=> copyBtn.textContent = 'Copiar', 1500);
});

// PWA
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./sw.js');
}