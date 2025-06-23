<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Web Generator</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --bg-color: #1a1c20;
            --surface-color: #25282e;
            --primary-color: #007bff;
            --primary-hover-color: #0056b3;
            --text-color: #e0e0e0;
            --text-muted-color: #a0a0a0;
            --border-color: #3a3f47;
            --input-bg-color: #2c3038;
            --success-color: #28a745;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Roboto', sans-serif;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }

        .container {
            width: 95%;
            max-width: 1400px;
            margin: 20px auto;
            padding: 25px;
            background-color: var(--surface-color);
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--border-color);
        }

        header h1 {
            font-size: 2.8em;
            color: var(--primary-color);
            margin-bottom: 10px;
            font-weight: 700;
        }

        header p {
            font-size: 1.1em;
            color: var(--text-muted-color);
        }

        .main-content {
            display: grid;
            grid-template-columns: 1fr 2fr;
            gap: 30px;
        }

        #web-gen-form .form-group {
            margin-bottom: 20px;
        }

        #web-gen-form label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: var(--text-muted-color);
            font-size: 0.95em;
        }

        #web-gen-form input[type="text"],
        #web-gen-form select,
        #web-gen-form textarea {
            width: 100%;
            padding: 14px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            background-color: var(--input-bg-color);
            color: var(--text-color);
            font-size: 1em;
            transition: border-color 0.3s, box-shadow 0.3s;
        }

        #web-gen-form input[type="text"]:focus,
        #web-gen-form select:focus,
        #web-gen-form textarea:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
        }

        #web-gen-form textarea {
            min-height: 120px;
            resize: vertical;
        }

        #generate-button {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            padding: 15px 25px;
            border: none;
            background: linear-gradient(135deg, var(--primary-color), #005cbf);
            color: white;
            border-radius: 8px;
            cursor: pointer;
            font-size: 1.1em;
            font-weight: 500;
            transition: background 0.3s, transform 0.1s;
            box-shadow: 0 4px 15px rgba(0, 123, 255, 0.2);
        }
        
        #generate-button:hover {
            background: linear-gradient(135deg, var(--primary-hover-color), #004a99);
            box-shadow: 0 6px 20px rgba(0, 123, 255, 0.3);
        }

        #generate-button:active {
            transform: translateY(1px);
        }

        #generate-button .spinner {
            display: none;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-right: 10px;
        }

        #generate-button.loading .spinner {
            display: inline-block;
        }
        #generate-button.loading span {
            margin-left: 5px;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        #output-section {
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .tabs {
            display: flex;
            background-color: var(--input-bg-color);
        }

        .tab-button {
            flex: 1;
            padding: 12px 15px;
            background-color: transparent;
            color: var(--text-muted-color);
            border: none;
            border-bottom: 3px solid transparent;
            cursor: pointer;
            font-size: 1em;
            font-weight: 500;
            transition: color 0.3s, border-bottom-color 0.3s;
        }

        .tab-button.active {
            color: var(--primary-color);
            border-bottom-color: var(--primary-color);
        }
        .tab-button:hover:not(.active) {
            color: var(--text-color);
        }
        
        .tab-content {
            display: none;
            height: 600px;
            background-color: var(--bg-color);
        }

        .tab-content.active {
            display: block;
        }

        #preview-container {
            position: relative;
        }

        #live-preview-iframe {
            width: 100%;
            height: 100%;
            border: none;
            background-color: #fff;
        }

        #iframe-placeholder {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: var(--text-muted-color);
            font-size: 1.2em;
            text-align: center;
        }

        #code-container {
            position: relative;
            padding: 20px;
            overflow: auto;
        }
        
        #generated-code-block {
            white-space: pre-wrap;
            word-wrap: break-word;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: var(--text-color);
        }

        #copy-code-button {
            position: absolute;
            top: 15px;
            right: 15px;
            padding: 8px 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9em;
            opacity: 0.8;
            transition: opacity 0.3s, background-color 0.3s;
        }
        #copy-code-button:hover {
            opacity: 1;
            background-color: var(--primary-hover-color);
        }

        footer {
            text-align: center;
            padding: 20px;
            margin-top: auto;
            background-color: var(--surface-color);
            border-top: 1px solid var(--border-color);
            font-size: 0.9em;
            color: var(--text-muted-color);
        }

        @media (max-width: 992px) {
            .main-content {
                grid-template-columns: 1fr;
            }
            header h1 {
                font-size: 2.2em;
            }
             #output-section .tab-content {
                height: 500px; 
            }
        }
        @media (max-width: 768px) {
            .container {
                width: 100%;
                margin: 0;
                border-radius: 0;
                padding: 15px;
            }
             header h1 {
                font-size: 1.8em;
            }
            header p {
                font-size: 1em;
            }
            #web-gen-form input[type="text"],
            #web-gen-form select,
            #web-gen-form textarea,
            #generate-button {
                font-size: 0.95em;
            }
             #output-section .tab-content {
                height: 400px; 
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>AI Web Weaver <span style="font-size: 0.7em; vertical-align: middle;">✨</span></h1>
            <p>Describe your dream website, and let AI bring it to life!</p>
        </header>

        <div class="main-content">
            <form id="web-gen-form">
                <div class="form-group">
                    <label for="web-type">Jenis Web:</label>
                    <select id="web-type" name="web-type">
                        <option value="portfolio">Portfolio Pribadi</option>
                        <option value="landing page">Landing Page Produk/Jasa</option>
                        <option value="toko online sederhana">Toko Online Sederhana</option>
                        <option value="blog pribadi">Blog Pribadi</option>
                        <option value="company profile">Company Profile</option>
                        <option value="event invitation">Undangan Event</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="web-theme">Tema Web:</label>
                    <select id="web-theme" name="web-theme">
                        <option value="modern dan bersih">Modern & Bersih</option>
                        <option value="minimalist dengan banyak white space">Minimalist</option>
                        <option value="playful dan berwarna-warni">Playful & Berwarna</option>
                        <option value="elegan dan mewah">Elegan & Mewah</option>
                        <option value="korporat dan profesional">Korporat & Profesional</option>
                        <option value="dark mode futuristic">Dark Mode Futuristik</option>
                        <option value="vintage retro">Vintage/Retro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="web-colors">Warna Spesifik/Palet:</label>
                    <input type="text" id="web-colors" name="web-colors" placeholder="Mis: Biru navy, emas, putih gading atau Deskripsikan palet">
                </div>

                <div class="form-group">
                    <label for="web-description">Deskripsi Tambahan (Opsional):</label>
                    <textarea id="web-description" name="web-description" placeholder="Jelaskan fitur utama, bagian-bagian web, atau inspirasi gaya yang Anda inginkan..."></textarea>
                </div>

                <button type="submit" id="generate-button">
                    <span class="spinner"></span>
                    <span class="button-text">Generate Website</span>
                </button>
            </form>

            <div id="output-section">
                <div class="tabs">
                    <button class="tab-button active" data-tab="preview">Live Preview</button>
                    <button class="tab-button" data-tab="code">View Code</button>
                </div>
                <div id="preview-container" class="tab-content active">
                    <iframe id="live-preview-iframe" title="Live Preview" sandbox="allow-scripts allow-same-origin"></iframe>
                    <div id="iframe-placeholder">AI akan menampilkan hasil web di sini... Klik 'Generate Website' untuk memulai.</div>
                </div>
                <div id="code-container" class="tab-content">
                    <pre><code id="generated-code-block"></code></pre>
                    <button id="copy-code-button" title="Salin Kode">Salin Kode</button>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>© <script>document.write(new Date().getFullYear())</script> AI Web Generator. Powered by Qwen AI.</p>
    </footer>

    <script>
        const form = document.getElementById('web-gen-form');
        const generateButton = document.getElementById('generate-button');
        const buttonText = generateButton.querySelector('.button-text');
        
        const livePreviewIframe = document.getElementById('live-preview-iframe');
        const iframePlaceholder = document.getElementById('iframe-placeholder');
        const generatedCodeBlock = document.getElementById('generated-code-block');
        const copyCodeButton = document.getElementById('copy-code-button');

        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        let fullHtmlContent = '';

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const targetTab = button.getAttribute('data-tab');
                tabContents.forEach(content => {
                    if (content.id === targetTab + '-container') {
                        content.classList.add('active');
                    } else {
                        content.classList.remove('active');
                    }
                });
            });
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const webType = document.getElementById('web-type').value;
            const webTheme = document.getElementById('web-theme').value;
            const webColors = document.getElementById('web-colors').value;
            const webDescription = document.getElementById('web-description').value;

            let userPrompt = `Buatlah sebuah website dengan spesifikasi berikut:
Jenis Web: ${webType}
Tema: ${webTheme}
Warna/Palet: ${webColors || 'Pilihkan palet yang sesuai dengan tema'}
Deskripsi Tambahan: ${webDescription || 'buat sekreatif mungkin.'}
Gunakan css :root untuk font warna dan lainya

#Berikan code tanpa markdown tanpa penjelasan tanpa teks only code`;

            generateButton.classList.add('loading');
            buttonText.textContent = 'Generating...';
            generateButton.disabled = true;

            fullHtmlContent = '';
            livePreviewIframe.srcdoc = '';
            generatedCodeBlock.textContent = 'AI sedang merajut kode... 🧠';
            iframePlaceholder.style.display = 'block';
            iframePlaceholder.textContent = 'AI sedang merajut kode... 🧠';
            
            let isAnswerPhase = false;
            
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 menit timeout

                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: userPrompt }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error('Respons jaringan bermasalah: ' + response.statusText + ' - ' + errorText);
                }
                
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value, { stream: true });
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.trim().startsWith('data:')) {
                            try {
                                const jsonStr = line.substring(5).trim();
                                if (jsonStr === '[DONE]') continue;
                                
                                const data = JSON.parse(jsonStr);
                                const delta = data.choices?.[0]?.delta;

                                if (delta && delta.phase === 'answer') {
                                    if (!isAnswerPhase) {
                                        isAnswerPhase = true;
                                        fullHtmlContent = '';
                                        generatedCodeBlock.textContent = '';
                                        iframePlaceholder.style.display = 'none';
                                    }
                                    if (delta.content) {
                                        fullHtmlContent += delta.content;
                                        generatedCodeBlock.textContent = fullHtmlContent;
                                        livePreviewIframe.srcdoc = fullHtmlContent; 
                                    }
                                } else if (delta && delta.content && !isAnswerPhase) {
                                }
                            } catch (err) {
                            }
                        }
                    }
                }
                if (!isAnswerPhase && fullHtmlContent === '') {
                    generatedCodeBlock.textContent = 'Tidak ada output HTML yang valid dari AI. Coba lagi dengan prompt berbeda.';
                    iframePlaceholder.textContent = 'Gagal menghasilkan web. Coba lagi.';
                    iframePlaceholder.style.display = 'block';
                }

            } catch (error) {
                console.error('Fetch error:', error);
                generatedCodeBlock.textContent = 'Terjadi kesalahan: ' + error.message;
                iframePlaceholder.textContent = 'Terjadi kesalahan. Lihat konsol untuk detail.';
                iframePlaceholder.style.display = 'block';
            } finally {
               generateButton.classList.remove('loading');
               buttonText.textContent = 'Generate Website';
               generateButton.disabled = false;
            }
        });

        copyCodeButton.addEventListener('click', () => {
            if (navigator.clipboard && generatedCodeBlock.textContent) {
                navigator.clipboard.writeText(generatedCodeBlock.textContent)
                    .then(() => {
                        copyCodeButton.textContent = 'Disalin!';
                        setTimeout(() => { copyCodeButton.textContent = 'Salin Kode'; }, 2000);
                    })
                    .catch(err => {
                        console.error('Gagal menyalin kode: ', err);
                        alert('Gagal menyalin. Silakan salin manual.');
                    });
            } else {
                try {
                    const textArea = document.createElement("textarea");
                    textArea.value = generatedCodeBlock.textContent;
                    document.body.appendChild(textArea);
                    textArea.focus();
                    textArea.select();
                    document.execCommand('copy');
                    document.body.removeChild(textArea);
                    copyCodeButton.textContent = 'Disalin!';
                    setTimeout(() => { copyCodeButton.textContent = 'Salin Kode'; }, 2000);
                } catch (err) {
                    alert('Gagal menyalin. Silakan salin manual.');
                }
            }
        });
    </script>
</body>
</html>
