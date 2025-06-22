.const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 for CommonJS
const WebSocket = require('ws');
const http = require('http');

const setBot = `You are an expert on frontend design, you will always respond to web design tasks.
Your task is to create a website using a SINGLE static HTML file. This file must contain all necessary HTML structure, CSS styles within a <style> tag (preferably in the <head>), and JavaScript code within a <script> tag (preferably at the end of the <body> or in <head> with 'defer').
The entire website must be self-contained in this single HTML file. No external CSS or JS files. Do not use JSX or React.

## Common Design Principles

Regardless of the technology used, follow these principles for all designs:

### General Design Guidelines:
- Create a stunning, contemporary, and highly functional website based on the user's request
- Implement a cohesive design language throughout the entire website/application
- Choose a carefully selected, harmonious color palette that enhances the overall aesthetic
- Create a clear visual hierarchy with proper typography to improve readability
- Incorporate subtle animations and transitions to add polish and improve user experience
- Ensure proper spacing and alignment using appropriate layout techniques
- Implement responsive design principles to ensure the website looks great on all device sizes
- Use modern UI patterns like cards, gradients, and subtle shadows to add depth and visual interest
- Incorporate whitespace effectively to create a clean, uncluttered design
- For images, use placeholder images from services like https://placehold.co/

### UI/UX Design Focus:
- **Typography**: Use a combination of font weights and sizes to create visual interest and hierarchy
- **Color**: Implement a cohesive color scheme that complements the content and enhances usability
- **Layout**: Design an intuitive and balanced layout that guides the user's eye and facilitates easy navigation
- **Microinteractions**: Add subtle hover effects, transitions, and animations to enhance user engagement
- **Consistency**: Maintain a consistent design language throughout all components and sections
- **Mobile-first approach**: Design for mobile devices first, then enhance for larger screens
- **Touch targets**: Ensure all interactive elements are large enough for touch input
- **Loading states**: Implement skeleton screens and loading indicators for dynamic content (if applicable, for async operations within the JS)
- **Error states**: Design clear error messages and recovery paths
- **Empty states**: Design meaningful empty states with clear calls to action
- **Success states**: Provide clear feedback for successful actions
- **Interactive elements**: Design clear hover and active states
- **Form design**: Create intuitive and user-friendly forms with proper validation feedback (using vanilla JS)
- **Navigation**: Implement clear and consistent navigation patterns
- **Search functionality**: Implement proper search UI if needed
- **Filtering and sorting**: Design clear UI for data manipulation if needed
- **Pagination**: Implement proper pagination UI if needed
- **Modal and dialog design**: Create proper modal and dialog UI if needed
- **Toast notifications**: Implement proper notification system if needed
- **Progress indicators**: Show clear progress for multi-step processes

### Technical Best Practices (for single HTML/CSS/JS file):
- Use proper accessibility attributes (ARIA labels, roles, etc.)
- Implement keyboard navigation support
- Ensure semantic HTML structure with proper heading levels (e.g., \`<h1>\`, \`<h2>\`)
- All CSS must be within a \`<style>\` tag in the \`<head>\`.
- All JavaScript must be within a \`<script>\` tag, preferably at the end of the \`<body>\`, or in the \`<head>\` if using \`defer\`. Use vanilla JavaScript. Do not use any external libraries or frameworks (like jQuery) unless specifically requested for a simple utility function.
- Include loading states for any asynchronous JavaScript operations if applicable.
- Use localStorage/sessionStorage for client-side data persistence if needed.
- Implement proper event handling and cleanup for JavaScript to avoid memory leaks (e.g., removing event listeners if elements are removed dynamically).
- Use proper form validation (client-side with JS) and error handling.
- Implement proper error messages and user feedback directly in the HTML/JS.

Remember to only return code for the single HTML file (including inline CSS and JS) and nothing else.
The resulting application should be visually impressive, highly functional, and something users would be proud to showcase.`;

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// --- Fungsi Inti untuk Memproses Permintaan Qwen ---
async function processQwenRequest(userPrompt, requestTimeoutMillis = 10 * 60 * 1000) {
    // requestTimeoutMillis default 10 menit untuk WS, bisa dioverride lebih pendek untuk HTTP
    const baseData = {
        "stream": false, "incremental_output": true, "chat_type": "artifacts", "model": "qwen3-235b-a22b",
        "messages": [
            { "role": "system", "content": setBot },
            {
                "id": "4095b26c-b850-4ab3-b01e-940eb5ec454c", "role": "user", "content": "",
                "extra": { "meta": { "subChatType": "web_dev" } },
                "feature_config": { "thinking_enabled": true, "output_schema": "phase", "thinking_budget": 38912 },
                "chat_type": "artifacts"
            }
        ],
        "session_id": "e5d4bb9b-1d36-4041-b69a-eab4a06872b6", "chat_id": "cece03ae-1152-460b-a5bf-549e033a5479",
        "id": "9c0502e3-438f-4f7e-8cf6-81ea6a343457", "sub_chat_type": "web_dev", "chat_mode": "normal"
    };

    const requestData = JSON.parse(JSON.stringify(baseData));
    const userMessageIndex = requestData.messages.findIndex(msg => msg.role === "user");
    if (userMessageIndex !== -1) {
        requestData.messages[userMessageIndex].content = userPrompt;
    } else {
        // Fallback, seharusnya tidak terjadi dengan struktur ini
        if (requestData.messages[1] && requestData.messages[1].role === "user") {
            requestData.messages[1].content = userPrompt;
        } else {
            throw new Error("Internal server error: Could not structure user prompt.");
        }
    }

    const options = {
        method: 'POST',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
            'Content-Type': 'application/json',
            'x-request-id': `req-${Date.now()}-${Math.random().toString(36).substring(7)}`,
            'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDcwNX0.c1DgpjRR04FtayZmbKwHyeR8cl3PcOaxfgyvFLGOdsk', // PERHATIAN: TOKEN EXPIRED
            // ... (sisa header penting lainnya, pastikan bx-umidtoken, bx-ua, Cookie, dll, valid dan diperbarui jika perlu)
            'bx-umidtoken': 'T2gAdb3Jqs_V26fFkIIHv_AbjC04jEk4Kpp3lebt-XeSvPRw1KUAb9xiryHQd1ok9ls=', // Contoh, mungkin perlu diganti
             'Cookie': 'cna=SefaIJmSIQACAbYCL0RbM3OS; ...', // Contoh, mungkin perlu diganti
        },
        body: JSON.stringify(requestData)
    };

    const qwenApiUrl = 'https://chat.qwen.ai/api/chat/completions';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        controller.abort();
        console.log(`Request to ${qwenApiUrl} timed out after ${requestTimeoutMillis / 1000}s`);
    }, requestTimeoutMillis);

    options.signal = controller.signal;

    console.log(`Sending request to Qwen API with prompt: "${userPrompt}", timeout: ${requestTimeoutMillis / 1000}s`);
    const qwenResponse = await fetch(qwenApiUrl, options);
    clearTimeout(timeoutId);

    if (!qwenResponse.ok) {
        const errorText = await qwenResponse.text();
        const error = new Error(`Gagal menghubungi Qwen API: ${qwenResponse.status} ${qwenResponse.statusText}`);
        error.statusCode = qwenResponse.status;
        error.details = errorText;
        throw error;
    }

    const qwenResult = await qwenResponse.json();
    if (qwenResult.choices && qwenResult.choices.length > 0 && qwenResult.choices[0].message && qwenResult.choices[0].message.content) {
        return qwenResult.choices[0].message.content;
    } else {
        const error = new Error("Gagal memproses respons dari Qwen API. Struktur tidak dikenali.");
        error.qwenResponse = qwenResult; // Sertakan respons asli untuk debugging
        throw error;
    }
}
// --- End Fungsi Inti ---


// --- Endpoint HTTP GET ---
// Endpoint ini akan memiliki timeout yang lebih pendek
app.get('/chat_http', async (req, res) => {
    const userPrompt = req.query.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: "Parameter 'prompt' dibutuhkan." });
    }

    const HTTP_REQUEST_TIMEOUT = 120 * 1000; // 2 menit timeout untuk HTTP GET

    try {
        console.log(`HTTP GET /chat_http received prompt: "${userPrompt}"`);
        const aiContent = await processQwenRequest(userPrompt, HTTP_REQUEST_TIMEOUT);
        res.json({ response: aiContent });
    } catch (error) {
        console.error("Error in /chat_http:", error);
        if (error.name === 'AbortError') {
            return res.status(504).json({ error: "Permintaan ke Qwen API timeout (batas waktu HTTP tercapai)." });
        }
        const statusCode = error.statusCode || 500;
        res.status(statusCode).json({
            error: error.message || "Terjadi kesalahan internal.",
            details: error.details,
            qwenResponse: error.qwenResponse // Sertakan jika ada
        });
    }
});


// --- WebSocket Server Logic ---
console.log(`WebSocket Server is setting up...`);
wss.on('connection', (ws) => {
    console.log('Client connected to WebSocket');

    ws.on('message', async (message) => {
        let userPrompt;
        try {
            const parsedMessage = JSON.parse(message);
            userPrompt = parsedMessage.prompt;
        } catch (e) {
            console.error("Failed to parse WS message or missing prompt:", message.toString());
            ws.send(JSON.stringify({ error: "Pesan tidak valid atau parameter 'prompt' tidak ditemukan. Pastikan mengirim JSON dengan key 'prompt'." }));
            return;
        }

        if (!userPrompt) {
            ws.send(JSON.stringify({ error: "Parameter 'prompt' dibutuhkan dalam pesan JSON." }));
            return;
        }

        console.log(`Received prompt via WebSocket: "${userPrompt}"`);
        ws.send(JSON.stringify({ status: "Processing your request via WebSocket..." }));

        // Timeout yang lebih panjang untuk WebSocket
        const WEBSOCKET_REQUEST_TIMEOUT = 10 * 60 * 1000; // 10 menit

        try {
            const aiContent = await processQwenRequest(userPrompt, WEBSOCKET_REQUEST_TIMEOUT);
            ws.send(JSON.stringify({ response: aiContent }));
        } catch (error) {
            console.error("Error processing WebSocket request to Qwen:", error);
            if (error.name === 'AbortError') {
                ws.send(JSON.stringify({ error: "Permintaan ke Qwen API timeout (batas waktu WebSocket tercapai)." }));
            } else {
                ws.send(JSON.stringify({
                    error: error.message || "Terjadi kesalahan internal saat memproses via WebSocket.",
                    details: error.details,
                    qwenResponse: error.qwenResponse
                }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected from WebSocket');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

app.get('/', (req, res) => {
    res.send('Qwen API Proxy (HTTP & WebSocket) is running!');
});

const serverOverallTimeout = 15 * 60 * 1000; // Timeout server HTTP keseluruhan
server.listen(PORT, () => {
    console.log(`HTTP and WebSocket Server is running on port ${PORT}`);
}).setTimeout(serverOverallTimeout);

console.log('Server setup complete.');
