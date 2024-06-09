"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const express_1 = __importDefault(require("express"));
const gptmodel_1 = __importDefault(require("./services/gptmodel"));
const csvReader_1 = __importDefault(require("./utils/csvReader"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/api/prompt', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = req.body;
    if (!content) {
        return res.status(400).json({ error: 'Content is required' });
    }
    try {
        const openAIService = new gptmodel_1.default();
        const response = yield openAIService.promptAssistant(content);
        res.json({ response });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.post('/api/summarize', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { company_name } = req.body;
    if (!company_name) {
        return res.status(400).json({ error: 'company_name is required' });
    }
    try {
        const openAIService = new gptmodel_1.default();
        const response = yield openAIService.promptAssistantSummarize(company_name);
        res.json({ response });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
app.get('/api/dataset', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield csvReader_1.default.readCSVFile('../../assets/Startup_Dataset.csv');
        res.json({ response });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to read CSV file' });
    }
}));
app.post('/api/chatbot', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const openAIService = new gptmodel_1.default();
        const response = yield openAIService.promptAssistantChatbot(message);
        res.json({ response });
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}));
server.listen(3000, () => {
    console.log('Server is running on port http://localhost:3000');
});
