// Bagian Node.js (Server)
const http = require('http');
const fetch = require('node-fetch'); // Pastikan sudah terinstal: npm install node-fetch

// --- DATA DAN OPTIONS API QWEN ANDA (PERSIS SEPERTI YANG ANDA BERIKAN, TIDAK DIUBAH) ---
const qwenApiPayloadOriginal = { // Nama variabel diubah untuk menandakan ini yang asli
  "stream": true,
  "incremental_output": true,
  "chat_type": "artifacts",
  "model": "qwen3-235b-a22b",
  "messages": [
    {
      "role": "system",
      "content": "you ai assistant" // Typo sudah diperbaiki dari contoh awal
    },
    {
      "id": "4095b26c-b850-4ab3-b01e-940eb5ec454c",
      "role": "user",
      "content": "hai", // Prompt default awal
      "extra": { "meta": { "subChatType": "web_dev" } },
      "feature_config": { "thinking_enabled": true, "output_schema": "phase", "thinking_budget": 38912 },
      "chat_type": "artifacts"
    }
  ],
  "session_id": "e5d4bb9b-1d36-4041-b69a-eab4a06872b6",
  "chat_id": "cece03ae-1152-460b-a5bf-549e033a5479",
  "id": "9c0502e3-438f-4f7e-8cf6-81ea6a343457",
  "sub_chat_type": "web_dev",
  "chat_mode": "normal"
};

const qwenApiOptionsOriginal = { // Nama variabel diubah
  method: 'POST',
  headers: { // HEADER PERSIS SEPERTI YANG ANDA BERIKAN
    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
    'Accept-Encoding': 'gzip, deflate, br, zstd', // node-fetch akan menangani encoding jika perlu
    'Content-Type': 'application/json',
    'x-request-id': 'f0e676f4-4ecd-46c7-9313-992a44cc85d0',
    'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDcwNX0.c1DgpjRR04FtayZmbKwHyeR8cl3PcOaxfgyvFLGOdsk',
    'bx-umidtoken': 'T2gAdb3Jqs_V26fFkIIHv_AbjC04jEk4Kpp3lebt-XeSvPRw1KUAb9xiryHQd1ok9ls=',
    'x-accel-buffering': 'no',
    'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
    'bx-ua': '231!zbp7hAmUhK3+j32+lA7TQXEjUq/YvqY2leOxacSC80vTPuB9lMZY9mRWFzrwLEV0PmcfY4rL2lSdPGet6eZTvMeBr8nc3dHDngm7uJYhfYE1huWCvpWrLMpk3S/BeoKEth704xl0zDzQL2iWkKsw5VFkEmUwhxiMHV/72VCHYcGpG9F0kpu1BmOSLE6n1O+I2AFPpeWXubUMp0TSNqjgaMH80l/byyC6nlmavTPNT2LEA8pZrICK2LKjwLPDe4eVhv4FUVwU6+/7aAkdW55xExuq/P94E8ARW07NECzr+hmepk4qk4MsH6oky3MoigNqPA+++4mW3i+h6XRm+mBtSoj0bGejYAtjDItW+++3NAo6wSko+jRHDjj09AjXNC6E3h+W+MELqi+zwm4+5VFW+Tt99YxjqCz4+IeWS+IUfejS68gN7KHW++j0jADjYCX+Y46RnosCo+r+vfjWr5ZYcqTp5HV2wtOHIy5JGkXQcKZbJe1uL8ZacCv63r/o3FDykIkaocRx4dgE1ZIu4r1+y8lYvfzMaKLdm7PGfyuWO4pguEWGxggv+MCpopwYcnT8lIn4uoStvnD/tWp8SWS1ol8ClIL/5v1UYgepD7+zm5f8btr+dMA2he/hbbK+14847bfG/ovNhSk/dSNQJl/C+hxhBCyS9+LuKYQ9CPAt8I7VoEgD2vnE664RWupKnnQr9G4aCS5wrNoUytR/Cw04f4I4T+UwIjS6/JDWJXfKAwhCGHSIROBY1nUhlK5FiiRCaKCARSYl0Aahb9SodyXUw7rzZKlQLqHg3XVS+AqI1VZIH8s7mpL/mwu1emzsvi2Ooxnlf2VHdo3zWuqNmBNU3o2K5VODbtwDyciStqi9rx4YZEK10a9potz5MP/0hK8AGR3ax4lLF87tlMH3wN3JMPfThmOl3fJ03cENhEOQH/WjQzUhrJwEIkclmJjhvX1L4syoT03dlXYeP0oQ0AAbVIxcrB0WpP//1okt2meHPdt8i+6xZxLYiqNdv3ei9lm1u2PvIOMD0jGshJCDElqXSKwILKZgRBQx+CbXgNYRXkCuG+OTB89OLQexSEQcAmyy7TeSct+gYDOTA9Psgw+DcF2b3hF5GUDVC07fs9jCV/eMsJcp7s+qWAGKw61n/cSncjWOermrKIcLJDtu2Yj2It2ttGE2STvfAIOfASNUHe+n0HaxxYYYieZIl4VPkpWxYQQ0Q5q44iPhBdkKNeCRS1Ua8Z+BDTvbVD647XpbGUNVRNnJaJvgRcX9X0ZW+yRqFkyWWipmaP3MnlO60CRFPiPMj72QdKO8TdLAqNq49AuJzu9oHbKTmKHqxzQAP3kJceZN1UK18VsX/WUjGWmjtUGlhBkrdolJS4atMxFUABdM0QCCkliJzwbNwxToXh49mvMcG7P5sLptVXIy9wd5q10cGcieLgoFn5l9hXfjd/wH/VbJSTmFiRCKbo6CuIeVekz30fIGVdZ69A5khnLQhig/nCOtZueO8kciGJ24Hk6hcEFwRSJYYpqP8IavbTLAhlI4K+HYFjGfWYIL+4HRC6QKAXbMRMyTqraNzcbnKbo0fxdfITJAww0PZc+08faM0WPjQYzSXQSSoeh/0d0HRJ5ZRz9BsYTz5Vf6feaOCRlVue466P9JaupUBQkJ9k5ITxMhas50TKcR+ZvXvoGpSD8FW4+GIi238yP7vtrk29gN68d6carvQ5BHObuTZYrDJvvSi6F0jKdqLRSvMZe7jd53P+xK9vAkxcQgZKuM358okRmoHy9V',
    'sec-ch-ua-mobile': '?1',
    'sec-ch-ua-platform': '"Android"',
    'source': 'h5',
    'DNT': '1',
    'version': '0.0.118',
    'bx-v': '2.5.31',
    'Origin': 'https://chat.qwen.ai',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
    'Referer': 'https://chat.qwen.ai/c/cece03ae-1152-460b-a5bf-549e033a5479',
    'Accept-Language': 'id,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6',
    'Cookie': 'cna=SefaIJmSIQACAbYCL0RbM3OS; acw_tc=0a03e55917504726415086933e4c4bad3a9facaab5d8c0b69c41f641cf6cc8; x-ap=ap-southeast-5; _bl_uid=g3mmIcvO5Ijmz87IIs1yopy8b60k; sca=128c2299; xlly_s=1; _gcl_au=1.1.2119113818.1750333767.791425251.1750472691.1750472690; _c_WBKFRo=I4xOpz9fP9h8wA3l47riQbn1ZRQ771uM77aE7hpp; _nb_ioWEgULi=; cnaui=6eaf888f-bb59-48dd-8844-b99298d56ea5; aui=6eaf888f-bb59-48dd-8844-b99298d56ea5; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDc3Mn0.SpxakwQhkbQ_tKdLEucidDT49kPkznizdGubY1VWKKQ; atpsida=da94afa625f4421d6f646fb8_1750472928_9; tfstk=gBHSWWt6JX9cQTwdA7xVhRG0jGyI2nJNyMZKjDBPv8e8RMgEXWEPU3cIG2u7yYyJr9aI7kBJq3m8H-EaY7BLvJFIh2r6xXo82opx7kBReQq8DZEzeWcz8zzQdD060FJwQ0muK8Lw7doWGIzzITB8Jw5YHu2Q2SV2BRnuKJL2rXKZn00o_wTm2JKbHkZNyJF8ySKbAlaLpzFdksETkJeLyzFAMkrNJ9CReniYokeLJ2epc-U0vhnRdojQ70tr9SJ5HE7mAr6dpxZXcynS2omohuN7CjafpokbV7at2AOnzRZs1xNZw3d8kYmtTvFAP3aE3mhaumAFczkxD2qb1MXIcDntCSD9utqS9ckzkYLhEycZfYVmBF1N4zWa5uK1O64Rpoawcn1htXJvnK_eg9Buwoq4zntfTYV8moawcn1ht7E0mE-Xc6kl.; isg=BFlZXay6VZ6_VQkPEva6KFBgaEcz5k2YfWnDh3sOgAAYgj0UxzcTaq3UgRhRe-XQ; ssxmod_itna=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWG5tDlc7TYDE1uPreB3WhTuKQxSYmxe32eKjbmHWKICh073tYeDIz40=DcxDNDGexGCD8qDMUAhiUYeDG4GyQENDj4DEnqbPxBQM3rNDt4G+U7G54qGm/d+3Ld4DAMoPETNDAfeDKqDnATrD7uRv3xPwBrE5bff5tW6X8DhiLAhe0gh=D1xetA4CUU0fDAEi97xC3liz8te=anbCuWWSm=Kq2x=cbd6X/h6=DE+XxP51SgvPnPqn6PjDmlw=WevlGPYD; ssxmod_itna2=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWGHYD=hduI+NKCx03lCQ6hu5DBucDeT1aO8p31uKzl06=GQZBndk3CKxaXwu6OdwEswqRFlWi7gi9zUW0KXrctP0PQGgbqXZD+W4KPdjaI76hOKe9xaOHHNigqX2rHeISPkt0+TRuDTEYHE4qNT60Pk=9qM4xH=jdQE9K1UieFlig6k6GAe/BFFK9KMFGONia0GZSD1pvn70F7v9jBTtIHcIxq4Sy7PjEmqmHjvad7NGDmc8bffx1hsqlQahQY08xCxG2Den19RFIxNmotrjDcfF=isPdHHdkrjx3DdEf4Ld3IWhjxY/O3kitPl19Sbd8r3+aXhQLuGx4Tfw=D64dWGU75XO=xEivjAqRNM+5HGtebQc3YjOrd6=aCDYLxeS4/A807rl7Hd7T0GbdkrPT6W7v/LAYPaYY+fnOf8hGEaLSNUG38biyg4W8fhitd7qBGrWhxWxpCRNhRLDktMhbeGiFIQnoT26DAEkN7TWf=bTn4Kxs/=kAFXF7VG5vddwO5CQ9TKjE3kbd7+p77gr0n37hmTID8knH0wWzgLUYCGA1dLuhTZRDIx4pSU3iAxqMdm4Q/4hDxvNezP5SA5V7xDOxKYZAv5Q9bBiDD'
  },
  body: JSON.stringify(qwenApiPayloadOriginal) // Menggunakan payload asli
};
// --- AKHIR DATA DAN OPTIONS API QWEN ---

// Fungsi untuk membuat konten HTML dinamis
function getHtmlContent() {
  return `
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Qwen AI Stream (Static Headers)</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background-color: #f4f4f4; color: #333; }
        #container { max-width: 800px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1 { color: #555; text-align: center; }
        #prompt-container { margin-bottom: 20px; display: flex; }
        #promptInput { flex-grow: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-right: 10px; }
        #sendButton { padding: 10px 15px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; }
        #sendButton:hover { background-color: #c82333; }
        #sendButton:disabled { background-color: #ccc; cursor: not-allowed; }
        #responseArea {
            border: 1px solid #ddd;
            padding: 15px;
            min-height: 200px;
            white-space: pre-wrap;
            background-color: #e9ecef;
            border-radius: 4px;
            overflow-y: auto;
            max-height: 400px;
        }
        .warning { color: orange; font-weight: bold; margin-bottom: 10px; border: 1px solid orange; padding: 10px; background-color: #fff3cd; border-radius: 4px;}
        .error { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <div id="container">
        <h1>Qwen AI Streaming (Menggunakan Header Statis/Asli)</h1>
        <div class="warning">
            <strong>PERINGATAN:</strong> Script ini menggunakan header otentikasi statis yang kemungkinan besar sudah kedaluwarsa. 
            Permintaan ke API Qwen mungkin akan gagal. Ini hanya untuk demonstrasi penggunaan header yang Anda berikan.
        </div>
        <div id="prompt-container">
            <input type="text" id="promptInput" placeholder="Ketik prompt Anda di sini..." value="tes">
            <button id="sendButton">Kirim ke Qwen (dengan Header Asli)</button>
        </div>
        <div id="responseArea">Menunggu input...</div>
    </div>

    <script>
        // Bagian JavaScript Klien (Browser)
        const promptInputElement = document.getElementById('promptInput');
        const sendButtonElement = document.getElementById('sendButton');
        const responseAreaElement = document.getElementById('responseArea');

        sendButtonElement.addEventListener('click', handleSendPromptToLocalServer);
        promptInputElement.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                handleSendPromptToLocalServer();
            }
        });

        async function handleSendPromptToLocalServer() {
            const userPrompt = promptInputElement.value.trim();
            if (!userPrompt) {
                responseAreaElement.textContent = 'Silakan masukkan prompt.';
                return;
            }

            responseAreaElement.textContent = '';
            responseAreaElement.classList.remove('error');
            responseAreaElement.textContent = 'Mengirim ke server lokal (menggunakan header asli), lalu ke Qwen...';
            sendButtonElement.disabled = true;
            promptInputElement.disabled = true;

            try {
                const response = await fetch('/stream-qwen-static', { // Endpoint baru
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ prompt: userPrompt }),
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(\`Error dari server lokal: \${response.status} \${response.statusText} - \${errorText}\`);
                }

                if (!response.body) {
                    throw new Error('ReadableStream tidak tersedia dari server lokal.');
                }
                
                responseAreaElement.textContent = ''; 

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let accumulatedText = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        break; 
                    }
                    const chunkText = decoder.decode(value, { stream: true });
                    accumulatedText += chunkText;
                    responseAreaElement.textContent = accumulatedText; 
                    responseAreaElement.scrollTop = responseAreaElement.scrollHeight;
                }
            } catch (error) {
                console.error('Error di sisi klien:', error);
                responseAreaElement.classList.add('error');
                responseAreaElement.textContent = \`Error: \${error.message}\`;
            } finally {
                sendButtonElement.disabled = false;
                promptInputElement.disabled = false;
            }
        }
    </script>
</body>
</html>
  `;
}


const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(getHtmlContent());
  } else if (req.url === '/stream-qwen-static' && req.method === 'POST') { // Endpoint diubah
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', async () => {
        try {
            const clientPayload = JSON.parse(body);
            const userPrompt = clientPayload.prompt;

            // Buat salinan payload asli agar tidak mengubah objek global qwenApiPayloadOriginal
            let currentPayload = JSON.parse(JSON.stringify(qwenApiPayloadOriginal)); 
            
            // Update prompt pengguna di payload yang akan dikirim
            const userMessageIndex = currentPayload.messages.findIndex(msg => msg.role === 'user');
            if (userMessageIndex !== -1) {
                currentPayload.messages[userMessageIndex].content = userPrompt;
            } else {
                 currentPayload.messages.push({
                    "id": `user-\${Date.now()}`,
                    "role": "user",
                    "content": userPrompt,
                    "extra": { "meta": { "subChatType": "web_dev" } },
                    "feature_config": { "thinking_enabled": true, "output_schema": "phase", "thinking_budget": 38912 },
                    "chat_type": "artifacts"
                 });
            }
            // ID bisa tetap sama dengan yang asli, atau di-generate baru jika API memerlukan unik per request
            // currentPayload.id = `req-static-${Date.now().toString(16)}`;

            // Gunakan qwenApiOptionsOriginal yang berisi header statis Anda
            const optionsForThisRequest = {
                ...qwenApiOptionsOriginal, // Salin semua header asli
                body: JSON.stringify(currentPayload) // Gunakan payload yang sudah diupdate dengan prompt baru
            };
            // Tidak perlu mengubah x-request-id jika ingin menggunakan yang asli

            console.log(`[Server] Mengirim prompt: "\${userPrompt}" ke Qwen DENGAN HEADER STATIS.`);
            // console.log("[Server] Menggunakan Headers (STATIS):", JSON.stringify(optionsForThisRequest.headers, null, 2).substring(0, 500) + "...");
            
            const qwenResponse = await fetch('https://chat.qwen.ai/api/chat/completions', optionsForThisRequest);

            if (!qwenResponse.ok) {
                let errorBodyText = 'Tidak dapat membaca body error dari Qwen.';
                try { errorBodyText = await qwenResponse.text(); } catch (e) {}
                console.error(`[Server] Error dari Qwen API (header statis): ${qwenResponse.status} ${qwenResponse.statusText}\nBody: ${errorBodyText.substring(0, 500)}...`);
                res.writeHead(qwenResponse.status, { 'Content-Type': 'text/plain' });
                res.end(`Error dari Qwen API (header statis): ${qwenResponse.status} ${qwenResponse.statusText} - ${errorBodyText.substring(0, 200)}... (Cek konsol server untuk detail lebih lanjut. Kemungkinan besar token kedaluwarsa.)`);
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'X-Content-Type-Options': 'nosniff'
            });

            const qwenReader = qwenResponse.body;
            const decoder = new TextDecoder('utf-8');
            let qwenBuffer = '';

            qwenReader.on('data', (chunk) => {
                qwenBuffer += decoder.decode(chunk, { stream: true });
                let boundary = qwenBuffer.indexOf('\\n\\n');
                if (qwenBuffer.includes("event: ") && qwenBuffer.includes("data: ")) {
                   boundary = qwenBuffer.lastIndexOf('\\n\\n') > -1 ? qwenBuffer.lastIndexOf('\\n\\n') : qwenBuffer.indexOf('\\n');
                } else {
                    res.write(qwenBuffer);
                    qwenBuffer = '';
                    return;
                }

                while (boundary !== -1) {
                    const sseMessage = qwenBuffer.substring(0, boundary).trim();
                    qwenBuffer = qwenBuffer.substring(boundary + (qwenBuffer.includes('\\n\\n') ? 2 : 1) );

                    if (sseMessage.startsWith('data: ')) {
                        const jsonDataString = sseMessage.substring(6).trim();
                        if (jsonDataString && jsonDataString !== '[DONE]') {
                            try {
                                const parsed = JSON.parse(jsonDataString);
                                let textChunk = '';
                                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                    textChunk = parsed.choices[0].delta.content;
                                } else if (parsed.output && parsed.output.text) {
                                    textChunk = parsed.output.text;
                                } else if (parsed.text) {
                                    textChunk = parsed.text;
                                }
                                if (textChunk) {
                                    res.write(textChunk);
                                }
                            } catch (e) {
                               if (jsonDataString) res.write(jsonDataString);
                            }
                        }
                    }
                     boundary = qwenBuffer.indexOf('\\n\\n');
                     if (qwenBuffer.includes("event: ") && qwenBuffer.includes("data: ")) {
                        boundary = qwenBuffer.lastIndexOf('\\n\\n') > -1 ? qwenBuffer.lastIndexOf('\\n\\n') : qwenBuffer.indexOf('\\n');
                     }
                }
            });

            qwenReader.on('end', () => {
                if (qwenBuffer.startsWith('data: ')) {
                    const jsonDataString = qwenBuffer.substring(6).trim();
                     if (jsonDataString && jsonDataString !== '[DONE]') {
                        try {
                            const parsed = JSON.parse(jsonDataString);
                             let textChunk = '';
                            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                textChunk = parsed.choices[0].delta.content;
                            } else if (parsed.output && parsed.output.text) {
                                textChunk = parsed.output.text;
                            }
                            if (textChunk) res.write(textChunk);
                        } catch(e) { if (jsonDataString) res.write(jsonDataString); }
                     }
                }
                console.log("[Server] Streaming dari Qwen (header statis) selesai.");
                res.end();
            });

            qwenReader.on('error', (err) => {
                console.error('[Server] Error pada stream Qwen (header statis):', err);
                if (!res.writableEnded) {
                    res.status = 500;
                    res.end('Error streaming dari Qwen API (header statis)');
                }
            });

        } catch (e) {
            console.error('[Server] Error memproses permintaan /stream-qwen-static:', e);
            if (!res.writableEnded) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Kesalahan Internal Server');
            }
        }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = 3001; // Port yang berbeda agar tidak bentrok jika Anda menjalankan yang lain
server.listen(PORT, () => {
  console.log(`Server (dengan header statis) berjalan di http://localhost:${PORT}`);
  console.log("PERINGATAN: Server ini menggunakan header otentikasi STATIS yang SANGAT MUNGKIN sudah kedaluwarsa.");
  console.log("Permintaan ke API Qwen kemungkinan besar akan GAGAL. Ini hanya untuk demonstrasi.");
});
