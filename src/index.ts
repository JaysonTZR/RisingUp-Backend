import openAiService from "./services/gptmodel";
import { Server } from "socket.io";
import { createServer } from "http";
import express from 'express';
import OpenAIService from "./services/gptmodel";
import csvReader from "./utils/csvReader";
import StartupCompanyService from "./services/startupCompany";
import { IAIPrompt } from "./entities/gptmodel";
import cors from "cors";

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.json());
app.use(cors());

app.post('/api/prompt', async (req, res) => {
    const content: IAIPrompt = req.body;

    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }

    try {
        const openAIService = new OpenAIService();
        const response = await openAIService.promptAssistant(content);
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/summarize', async (req, res) => {
    const { company_name } = req.body;

    if (!company_name) {
        return res.status(400).json({ error: 'company_name is required' });
    }

    try {
        const openAIService = new OpenAIService();
        const response = await openAIService.promptAssistantSummarize(company_name);
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/dataset', async (req, res) => {
    try {
        const response = await csvReader.readCSVFile('../../assets/Startup_Dataset.csv');
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to read CSV file' });
    }
});

app.post('/api/chatbot', async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const openAIService = new OpenAIService();
        const response = await openAIService.promptAssistantChatbot(message);
        res.json({ response });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

server.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});