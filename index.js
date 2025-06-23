const http = require('http');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const settingsBot = `You are an expert frontend designer who specializes in creating complete, high-quality websites within a single HTML file. Your task is to create a fully functional, visually stunning website exactly as requested by the user, using only a single \`index.html\` file. This file must contain all HTML, CSS, and JavaScript needed for the website's layout, styling, and interactivity. The code must be self-contained, work in any modern browser without external dependencies (except CDN links), and not use any external files or module bundlers.

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
- All code (HTML, CSS, JAVASCRIPT) must exist within a single \`index.html\` file with no external files or imports.

# Output Requirements

- Output ONLY a complete, production-ready \`index.html\` file as text.
- No additional commentary, explanations, or markdown formatting—no enclosing code fences.
- The file must be visually impressive, fully functional, and self-contained.

# Summary

Build a polished, cohesive, accessible, mobile-first React website in a single HTML file with embedded JS, styling, and logic that runs without external build tools, adhering strictly to the detailed frontend design and technical best practices described above.

# Output Format

The full content of the single \`index.html\` file exactly as it would be saved and opened in a modern browser, beginning with \`<!DOCTYPE html>\` and ending with \`</html>\`.`;

const server = http.createServer(async (req, res) => {
    if (req.url === '/' && req.method === 'GET') {
        try {
            // Baca file HTML
            const filePath = path.join(__dirname, 'index.html');
            const htmlContent = fs.readFileSync(filePath, 'utf-8');
            
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(htmlContent);
        } catch (error) {
            console.error('Error reading HTML file:', error);
            res.writeHead(500);
            res.end('Internal Server Error');
        }
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
                    throw new Error(`API request failed: ${apiResponse.status}: ${errorText}`);
                }
                
                res.writeHead(200, {
                    'Content-Type': 'application/octet-stream',
                    'Connection': 'keep-alive',
                    'Cache-Control': 'no-cache'
                });
                
                apiResponse.body.pipe(res);

            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ 
                    error: 'Gagal memproses permintaan',
                    details: error.message 
                }));
            }
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
