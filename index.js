const express = require('express');
const fetch = require('node-fetch'); // node-fetch v2 for CommonJS


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
const PORT = process.env.PORT || 8080; // Koyeb akan menyediakan PORT env var

// Middleware untuk parsing JSON body (meskipun tidak kita gunakan untuk endpoint GET ini)
app.use(express.json());

// Timeout server yang panjang. Koyeb mungkin punya batasannya sendiri di level load balancer.
// Untuk fetch, kita akan handle timeout secara terpisah.
const serverTimeout = 10 * 60 * 1000; // 10 menit server timeout
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).setTimeout(serverTimeout);


app.get('/chat', async (req, res) => {
  const userPrompt = req.query.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: "Parameter 'prompt' dibutuhkan." });
  }

  // Data dasar untuk API Qwen
  // Sesuai permintaan, kita hanya akan mengubah content user
  const baseData = {
    "stream": false,
    "incremental_output": true,
    "chat_type": "artifacts",
    "model": "qwen3-235b-a22b",
    "messages": [
      {
        "role": "system",
        "content": setBot // Perhatikan ada spasi di awal " content", saya biarkan sesuai aslinya
      },
      {
        "id": "4095b26c-b850-4ab3-b01e-940eb5ec454c",
        "role": "user",
        "content": "", // Ini akan diganti dengan userPrompt
        "extra": {
          "meta": {
            "subChatType": "web_dev"
          }
        },
        "feature_config": {
          "thinking_enabled": true,
          "output_schema": "phase",
          "thinking_budget": 38912
        },
        "chat_type": "artifacts"
      }
    ],
    "session_id": "e5d4bb9b-1d36-4041-b69a-eab4a06872b6",
    "chat_id": "cece03ae-1152-460b-a5bf-549e033a5479",
    "id": "9c0502e3-438f-4f7e-8cf6-81ea6a343457",
    "sub_chat_type": "web_dev",
    "chat_mode": "normal"
  };

  // Salin data dan modifikasi pesan user
  const requestData = JSON.parse(JSON.stringify(baseData)); // Deep copy
  const userMessageIndex = requestData.messages.findIndex(msg => msg.role === "user");
  if (userMessageIndex !== -1) {
    requestData.messages[userMessageIndex].content = userPrompt;
  } else {
    // Jika tidak ada pesan user (seharusnya tidak terjadi dengan struktur ini)
    // Atau jika Anda ingin menambah pesan baru:
    // requestData.messages.push({ role: "user", content: userPrompt, id: "new-user-message-id" });
    // Untuk saat ini, kita asumsikan struktur pesan user selalu ada seperti di baseData
    console.warn("User message object not found in template, using default user prompt logic");
    // Fallback jika tidak ditemukan (seharusnya pesan kedua):
    if (requestData.messages[1] && requestData.messages[1].role === "user") {
        requestData.messages[1].content = userPrompt;
    } else {
        return res.status(500).json({ error: "Internal server error: Could not structure user prompt." });
    }
  }


  const options = {
    method: 'POST',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br, zstd',
      'Content-Type': 'application/json',
      'x-request-id': 'f0e676f4-4ecd-46c7-9313-992a44cc85d0', // Ini mungkin perlu di-generate unik per request
      'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDcwNX0.c1DgpjRR04FtayZmbKwHyeR8cl3PcOaxfgyvFLGOdsk', // PERHATIAN: TOKEN INI AKAN EXPIRED
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
      // Cookie di-hardcode. Ini juga berpotensi jadi masalah jika API memerlukan cookie yang valid/dinamis.
      'Cookie': 'cna=SefaIJmSIQACAbYCL0RbM3OS; acw_tc=0a03e55917504726415086933e4c4bad3a9facaab5d8c0b69c41f641cf6cc8; x-ap=ap-southeast-5; _bl_uid=g3mmIcvO5Ijmz87IIs1yopy8b60k; sca=128c2299; xlly_s=1; _gcl_au=1.1.2119113818.1750333767.791425251.1750472691.1750472690; _c_WBKFRo=I4xOpz9fP9h8wA3l47riQbn1ZRQ771uM77aE7hpp; _nb_ioWEgULi=; cnaui=6eaf888f-bb59-48dd-8844-b99298d56ea5; aui=6eaf888f-bb59-48dd-8844-b99298d56ea5; token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZlYWY4ODhmLWJiNTktNDhkZC04ODQ0LWI5OTI5OGQ1NmVhNSIsImV4cCI6MTc1MzA2NDc3Mn0.SpxakwQhkbQ_tKdLEucidDT49kPkznizdGubY1VWKKQ; atpsida=da94afa625f4421d6f646fb8_1750472928_9; tfstk=gBHSWWt6JX9cQTwdA7xVhRG0jGyI2nJNyMZKjDBPv8e8RMgEXWEPU3cIG2u7yYyJr9aI7kBJq3m8H-EaY7BLvJFIh2r6xXo82opx7kBReQq8DZEzeWcz8zzQdD060FJwQ0muK8Lw7doWGIzzITB8Jw5YHu2Q2SV2BRnuKJL2rXKZn00o_wTm2JKbHkZNyJF8ySKbAlaLpzFdksETkJeLyzFAMkrNJ9CReniYokeLJ2epc-U0vhnRdojQ70tr9SJ5HE7mAr6dpxZXcynS2omohuN7CjafpokbV7at2AOnzRZs1xNZw3d8kYmtTvFAP3aE3mhaumAFczkxD2qb1MXIcDntCSD9utqS9ckzkYLhEycZfYVmBF1N4zWa5uK1O64Rpoawcn1htXJvnK_eg9Buwoq4zntfTYV8moawcn1ht7E0mE-Xc6kl.; isg=BFlZXay6VZ6_VQkPEva6KFBgaEcz5k2YfWnDh3sOgAAYgj0UxzcTaq3UgRhRe-XQ; ssxmod_itna=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWG5tDlc7TYDE1uPreB3WhTuKQxSYmxe32eKjbmHWKICh073tYeDIz40=DcxDNDGexGCD8qDMUAhiUYeDG4GyQENDj4DEnqbPxBQM3rNDt4G+U7G54qGm/d+3Ld4DAMoPETNDAfeDKqDnATrD7uRv3xPwBrE5bff5tW6X8DhiLAhe0gh=D1xetA4CUU0fDAEi97xC3liz8te=anbCuWWSm=Kq2x=cbd6X/h6=DE+XxP51SgvPnPqn6PjDmlw=WevlGPYD; ssxmod_itna2=QuG=5GOGCG7DODhcFGkDBCrG8D+anDl4BtGRSDIqGQGcD8gx0phB=c0If=eD8fzfC7xX5hzWGHYD=hduI+NKCx03lCQ6hu5DBucDeT1aO8p31uKzl06=GQZBndk3CKxaXwu6OdwEswqRFlWi7gi9zUW0KXrctP0PQGgbqXZD+W4KPdjaI76hOKe9xaOHHNigqX2rHeISPkt0+TRuDTEYHE4qNT60Pk=9qM4xH=jdQE9K1UieFlig6k6GAe/BFFK9KMFGONia0GZSD1pvn70F7v9jBTtIHcIxq4Sy7PjEmqmHjvad7NGDmc8bffx1hsqlQahQY08xCxG2Den19RFIxNmotrjDcfF=isPdHHdkrjx3DdEf4Ld3IWhjxY/O3kitPl19Sbd8r3+aXhQLuGx4Tfw=D64dWGU75XO=xEivjAqRNM+5HGtebQc3YjOrd6=aCDYLxeS4/A807rl7Hd7T0GbdkrPT6W7v/LAYPaYY+fnOf8hGEaLSNUG38biyg4W8fhitd7qBGrWhxWxpCRNhRLDktMhbeGiFIQnoT26DAEkN7TWf=bTn4Kxs/=kAFXF7VG5vddwO5CQ9TKjE3kbd7+p77gr0n37hmTID8knH0wWzgLUYCGA1dLuhTZRDIx4pSU3iAxqMdm4Q/4hDxvNezP5SA5V7xDOxKYZAv5Q9bBiDD'
    },
    timeout: 300000,
    body: JSON.stringify(requestData)
  };

  const qwenApiUrl = 'https://chat.qwen.ai/api/chat/completions';
  const requestTimeout = 5 * 60 * 1000; // 5 menit untuk fetch

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
    console.log(`Request to ${qwenApiUrl} timed out after ${requestTimeout / 1000}s`);
  }, requestTimeout);

  options.signal = controller.signal;

  try {
    console.log(`Sending request to Qwen API with prompt: "${userPrompt}"`);
    const qwenResponse = await fetch(qwenApiUrl, options);
    clearTimeout(timeoutId); // Batalkan timeout jika fetch selesai

    if (!qwenResponse.ok) {
      const errorText = await qwenResponse.text();
      console.error(`Qwen API Error: ${qwenResponse.status} ${qwenResponse.statusText}`, errorText);
      return res.status(qwenResponse.status).json({
        error: `Gagal menghubungi Qwen API: ${qwenResponse.status} ${qwenResponse.statusText}`,
        details: errorText
      });
    }

    const qwenResult = await qwenResponse.json();

    if (qwenResult.choices && qwenResult.choices.length > 0 && qwenResult.choices[0].message && qwenResult.choices[0].message.content) {
      const aiContent = qwenResult.choices[0].message.content;
      res.json({ response: aiContent });
    } else {
      console.error("Struktur respons dari Qwen API tidak sesuai harapan:", qwenResult);
      res.status(500).json({ error: "Gagal memproses respons dari Qwen API. Struktur tidak dikenali." });
    }

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: "Permintaan ke Qwen API timeout." });
    }
    console.error("Error saat menghubungi Qwen API:", error);
    res.status(500).json({ error: "Terjadi kesalahan internal saat menghubungi Qwen API.", details: error.message });
  }
});

// Endpoint dasar untuk cek apakah server hidup
app.get('/', (req, res) => {
  res.send('Qwen API Proxy is running!');
});
