const http = require('http');
const fetch = require('node-fetch');
const settingsBot = `You are an expert frontend designer who specializes in creating complete, high-quality websites within a single HTML file. Your task is to create a fully functional, visually stunning website exactly as requested by the user, using only a single \`index.html\` file. This file must contain all HTML, CSS, and JavaScript (including JSX written using Babel) needed for the website's layout, styling, and interactivity. The code must be self-contained, work in any modern browser without external dependencies (except CDN links), and not use any external files or module bundlers.

-- Follow these comprehensive design and technical guidelines to ensure excellence in every site you produce --

# Design Principles

- Create a contemporary, cohesive design language with a harmonious color palette that enhances aesthetics and usability.
- Establish a clear visual hierarchy using typography with varied weights and sizes.
- Use modern UI patterns such as cards, gradients, subtle shadows, and ample whitespace to create depth and clarity.
- Incorporate smooth, subtle animations and microinteractions such as hover effects and transitions to enhance user experience.
- Apply mobile-first responsive design so that the site looks excellent and functions perfectly on all device sizes.
- Ensure proper spacing, alignment, and intuitive layout to guide user navigation effortlessly.

# UI/UX Focus

- Maintain consistent design languages and styles across all components and sections.
- Design all interactive elements with adequate touch target sizes and clear hover/active states.
- Implement user-friendly forms with validation, error, success states, and feedback.
- Include meaningful empty, loading (skeleton screens), error, and success states.
- Add appropriate navigation, search, filtering, sorting, pagination, modals, toasts, and progress indicators if applicable to the use case.
- Use placeholder images from https://placehold.co/ where images are needed.

# Technical Best Practices

- Use semantic HTML with correct heading levels and ARIA roles and labels to ensure accessibility.
- Support keyboard navigation fully.
- Use React functional components: Define a default component named \`App\`.
- Use React hooks like \`useState\` and \`useEffect\` as necessary.
- Inline SVG icons must be used instead of external icon libraries.
- Employ TailwindCSS via CDN for utility-first styling or write plain CSS in a <style> tag.
- Mount the React app into a <div id="root"></div> using \`ReactDOM.createRoot(document.getElementById('root')).render(<App />)\`.
- Use CDN links only for React, ReactDOM, Babel, and optionally TailwindCSS.
- All code (HTML, JSX, CSS) must exist within a single \`index.html\` file with no external files or imports.

# JSX-in-HTML Implementation Details

- The HTML file starts with \`<!DOCTYPE html>\` and ends with \`</html>\`.
- Use <script type="text/babel"> for embedding JSX.
- The entire website's logic, layout, and styles must reside in this single file.

# Output Requirements

- Output ONLY a complete, production-ready \`index.html\` file as text.
- No additional commentary, explanations, or markdown formatting—no enclosing code fences.
- The file must be visually impressive, fully functional, and self-contained.

# Summary

Build a polished, cohesive, accessible, mobile-first React website in a single HTML file with embedded JSX, styling, and logic that runs without external build tools, adhering strictly to the detailed frontend design and technical best practices described above.

# Output Format

The full content of the single \`index.html\` file exactly as it would be saved and opened in a modern browser, beginning with \`<!DOCTYPE html>\` and ending with \`</html>\`.`;

const server = http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
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
                    <p>© ${new Date().getFullYear()} AI Web Generator. Powered by Qwen AI.</p>
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

                        let userPrompt = \`Buatlah sebuah website dengan spesifikasi berikut:
Jenis Web: \${webType}
Tema: \${webTheme}
Warna/Palet: \${webColors || 'Pilihkan palet yang sesuai dengan tema'}
Deskripsi Tambahan: \${webDescription || 'buat sekreatif mungkin.'}
Gunakan css :root untuk font warna dan lainya

#Berikan code tanpa markdown tanpa penjelasan tanpa teks only code\`;

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
                            const response = await fetch('/chat', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ prompt: userPrompt })
                            });

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
                                const lines = chunk.split('\\n');

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
        `);
    } else if (req.url === '/chat' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            try {
                const { prompt } = JSON.parse(body);

                const data = {
                    "stream": true,
                    "incremental_output": true,
                    "chat_type": "artifacts",
                    "model": "qwen3-235b-a22b",
                    "messages": [
                        {
                            "role": "system",
                            "content": settingsBot
                        },
                        {
                            "role": "user",
                            "content": prompt,
                            "extra": { "meta": { "subChatType": "web_dev" } },
                            "feature_config": { "thinking_enabled": true, "output_schema": "phase", "thinking_budget": 38912 },
                            "chat_type": "artifacts"
                        }
                    ],
                    "session_id": "e5d4bb9b-1d36-4041-b69a-eab4a06872b6",
                    "chat_id": "cece03ae-1152-460b-a5bf-549e033a5479",
                    "sub_chat_type": "web_dev",
                    "chat_mode": "normal"
                };

                const options = {
                    method: 'POST',
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
                        'Accept-Encoding': 'gzip, deflate, br, zstd',
                        'Content-Type': 'application/json',
                        'x-request-id': require('crypto').randomBytes(16).toString('hex'),
                        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDcwNX0.c1DgpjRR04FtayZmbKwHyeR8cl3PcOaxfgyvFLGOdsk',
                        'bx-umidtoken': 'T2gAdb3Jqs_V26fFkIIHv_AbjC04jEk4Kpp3lebt-XeSvPRw1KUAb9xiryHQd1ok9ls=',
                        'x-accel-buffering': 'no',
                        'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                        'bx-ua': '231!zbp7hAmUhK3+j32+lA7TQXEjUq/YvqY2leOxacSC80vTPuB9lMZY9mRWFzrwLEV0PmcfY4rL2lSdPGet6eZTvMeBr8nc3dHDngm7uJYhfYE1huWCvpWrLMpk3S/BeoKEth704xl0zDzQL2iWkKsw5VFkEmUwhxiMHV/72VCHYcGpG9F0kpu1BmOSLE6n1O+I2AFPpeWXubUMp0TSNqjgaMH80l/byyC6nlmavTPNT2LEA8pZrICK2LKjwLPDe4eVhv4FUVwU6+/7aAkdW55xExuq/P94E8ARW07NECzr+hmepk4qk4MsH6oky3MoigNqPA+++4mW3i+h6XRm+mBtSoj0bGejYAtjDItW+++3NAo6wSko+jRHDjj09AjXNC6E3h+W+MELqi+zwm4+5VFW+Tt99YxjqCz4+IeWS+IUfejS68gN7KHW++j0jADjYCX+Y46RnosCo+r+vfjWr5ZYcqTp5HV2wtOHIy5JGkXQcKZbJe1uL8ZacCv63r/o3FDykIkaocRx4dgE1ZIu4r1+y8lYvfzMaKLdm7PGfyuWO4pguEWGxggv+MCpopwYcnT8lIn4uoStvnD/tWp8SWS1ol8ClIL/5v1UYgepD7+zm5f8btr+dMA2he/hbbK+14847bfG/ovNhSk/dSNQJl/C+hxhBCyS9+LuKYQ9CPAt8I7VoEgD2vnE664RWupKnnQr9G4aCS5wrNoUytR/Cw04f4I4T+UwIjS6/JDWJXfKAwhCGHSIROBY1nUhlK5FiiRCaKCARSYl0Aahb9SodyXUw7rzZKlQLqHg3XVS+AqI1VZIH8s7mpL/mwu1emzsvi2Ooxnlf2VHdo3zWuqNmBNU3o2K5VODbtwDyciStqi9rx4YZEK10a9potz5MP/0hK8AGR3ax4lLF87tlMH3wN3JMPfThmOl3fJ03cENhEOQH/WjQzUhrJwEIkclmJjhvX1L4syoT03dlXYeP0oQ0AAbVIxcrB0WpP//1okt2meHPdt8i+6xZxLYiqNdv3ei9lm1u2PvIOMD0jGshJCDElqXSKwILKZgRBQx+CbXgNYRXkCuG+OTB89OLQexSEQcAmyy7TeSct+gYDOTA9Psgw+DcF2b3hF5GUDVC07fs9jCV/eMsJcp7s+qWAGKw61n/cSnc1jOermrKIcLJDtu2Yj2It2ttGE2STvfAIOfASNUHe+n0HaxxYYYieZIl4VPkpWxYQQ0Q5q44iPhBdkKNeCRS1Ua8Z+BDTvbVD647XpbGUNVRNnJaJvgRcX9X0ZW+yRqFkyWWipmaP3MnlO60CRFPiPMj72QdKO8TdLAqNq49AuJzu9oHbKTmKHqxzQAP3kJceZN1UK18VsX/WUjGWmjtUGlhBkrdolJS4atMxFUABdM0QCCkliJzwbNwxToXh49mvMcG7P5sLptVXIy9wd5q10cGcieLgoFn5l9hXfjd/wH/VbJSTmFiRCKbo6CuIeVekz30fIGVdZ69A5khnLQhig/nCOtZueO8kciGJ24Hk6hcEFwRSJYYpqP8IavbTLAhlI4K+HYFjGfWYIL+4HRC6QKAXbMRMyTqraNzcbnKbo0fxdfITJAww0PZc+08faM0WPjQYzSXQSSoeh/0d0HRJ5ZRz9BsYTz5Vf6feaOCRlVue466P9JaupUBQkJ9k5ITxMhas50TKcR+ZvXvoGpSD8FW4+GIi238yP7vtrk29gN68d6carvQ5BHObuTZYrDJvvSi6F0jKdqLRSvMZe7jd53P+xK9vAkxcQgZKuM358okRmoHy9V',
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
                        'Cookie': 'cna=SefaIJmSIQACAbYCL0RbM3OS; acw_tc=0a03e55917504726415086933e4c4bad3a9facaab5d8c0b69c41f641cf6cc8; x-ap=ap-southeast-5; _bl_uid=g3mmIcvO5Ijmz87IIs1yopy8b60k; sca=128c2299; xlly_s=1; _gcl_au=1.1.2119113818.1750333767.791425251.1750472691.1750472690; _c_WBKFRo=I4xOpz9fP9h8wA3l47riQbn1ZRQ771uM77aE7hpp; _nb_ioWEgULi=; cnaui=6eaf888f-bb59-48dd-8844-b99298d56ea5; aui=6eaf888f-bb59-48dd-8844-b99298d56ea5; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDc3Mn0.SpxakwQhkbQ_tKdLEucidDT49kPkznizdGubY1VWKKQ; atpsida=da94afa625f4421d6f646fb8_1750472928_9; tfstk=gBHSWWt6JX9cQTwdA7xVhRG0jGyI2nJNyMZKjDBPv8e8RMgEXWEPU3cIG2u7yYyJr9aI7kBJq3m8H-EaY7BLvJFIh2r6xXo82opx7kBReQq8DZEzeWcz8zzQdD060FJwQ0muK8Lw7doWGIzzITB8Jw5YHu2Q2SV2BRnuKJL2rXKZn00o_wTm2JKbHkZNyJF8ySKbAlaLpzFdksETkJeLyzFAMkrNJ9CReniYokeLJ2epc-U0vhnRdojQ70tr9SJ5HE7mAr6dpxZXcynS2omohuN7CjafpokbV7at2AOnzRZs1xNZw3d8kYmtTvFAP3aE3mhaumAFczkxD2qb1MXIcDntCSD9utqS9ckzkYLhEycZfYVmBF1N4zWa5uK1O64Rpoawcn1htXJvnK_eg9Buwoq4zntfTYV8moawcn1ht7E0mE-Xc6kl.; isg=BFlZXay6VZ6_VQkPEva6KFBgaEcz5k2YfWnDh3sOgAAYgj0UxzcTaq3UgRhRe-XQ; ssxmod_itna=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWG5tDlc7TYDE1uPreB3WhTuKQxSYmxe32eKjbmHWKICh073tYeDIz40=DcxDNDGexGCD8qDMUAhiUYeDG4GyQENDj4DEnqbPxBQM3rNDt4G+U7G54qGm/d+3Ld4DAMoPETNDAfeDKqDnATrD7uRv3xPwBrE5bff5tW6X8DhiLAhe0gh=D1xetA4CUU0fDAEi97xC3liz8te=anbCuWWSm=Kq2x=cbd6X/h6=DE+XxP51SgvPnPqn6PjDmlw=WevlGPYD; ssxmod_itna2=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWGHYD=hduI+NKCx03lCQ6hu5DBucDeT1aO8p31uKzl06=GQZBndk3CKxaXwu6OdwEswqRFlWi7gi9zUW0KXrctP0PQGgbqXZD+W4KPdjaI76hOKe9xaOHHNigqX2rHeISPkt0+TRuDTEYHE4qNT60Pk=9qM4xH=jdQE9K1UieFlig6k6GAe/BFFK9KMFGONia0GZSD1pvn70F7v9jBTtIHcIxq4Sy7PjEmqmHjvad7NGDmc8bffx1hsqlQahQY08xCxG2Den19RFIxNmotrjDcfF=isPdHHdkrjx3DdEf4Ld3IWhjxY/O3kitPl19Sbd8r3+aXhQLuGx4Tfw=D64dWGU75XO=xEivjAqRNM+5HGtebQc3YjOrd6=aCDYLxeS4/A807rl7Hd7T0GbdkrPT6W7v/LAYPaYY+fnOf8hGEaLS1UG38biyg4W8fhitd7qBGrWhxWxpCRNhRLDktMhbeGiFIQnoT26DAEkN7TWf=bTn4Kxs/=kAFXF7VG5vddwO5CQ9TKjE3kbd7+p77gr0n37hmTID8knH0wWzgLUYCGA1dLuhTZRDIx4pSU3iAxqMdm4Q/4hDxvNezP5SA5V7xDOxKYZAv5Q9bBiDD'
                    },
                    body: JSON.stringify(data)
                };

                const apiResponse = await fetch('https://chat.qwen.ai/api/chat/completions', options);

                if (!apiResponse.ok) {
                    const errorText = await apiResponse.text();
                    console.error('API Error Response Body:', errorText);
                    throw new Error(`API request failed with status ${apiResponse.status}: ${errorText}`);
                }
                
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache',
                });
                
                apiResponse.body.pipe(res);

            } catch (error) {
                console.error('Server error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Gagal mengambil data dari API', details: error.message }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    console.log("Pastikan Bearer Token, Cookie, dan header lain di backend masih valid!");
    console.log("Jika ada masalah, periksa tab Network di browser Anda saat menggunakan chat.qwen.ai dan perbarui header.");
});
