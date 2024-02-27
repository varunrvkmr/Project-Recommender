const path = require('path'); 
require('dotenv').config();
const express = require('express');
const app = express();
const OpenAI = require("openai").default;

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

let responseText = "";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page.html'));
});

let conversationContext = [];


app.post('/api/chat', async (req, res) => {
    
    //console.log(req.body); // Log the entire request body
    const { role, content } = req.body;
    
    let currentMessages = []; // Initialize here for each request

    // Restore the previous context
    for (const [inputText, responseText] of conversationContext) {
        currentMessages.push({ role: "user", content: inputText });
        currentMessages.push({ role: "assistant", content: responseText });
    }
    
    /*
    if (!role || !content) {
        console.log("Missing fields:", { role, content }); // Log missing fields for debugging
        return res.status(400).json({ error: "Both 'role' and 'content' fields are required." });
    }
    */

    // Construct the message array from the provided role and content
    const messages = [{ role, content }];
    currentMessages.push({ role, content });
    
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages, // Use the constructed messages array here
            temperature: 0.5,
            max_tokens: 64,
            top_p: 1
        });

        //res.json({ response: response.choices[0]})
        responseText = response.choices[0].message.content;
        conversationContext.push([messages, responseText]);
        console.log(responseText);
        res.json({ responseText: responseText });

    } catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
});

app.get('/get-response-text', (req, res) => {
    res.send(responseText);
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});