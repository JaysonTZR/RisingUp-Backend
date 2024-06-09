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
const openai_1 = __importDefault(require("openai"));
const fs = require("fs");
const startupCompany_1 = __importDefault(require("./startupCompany"));
const openai = new openai_1.default({ apiKey: '...' });
class OpenAIService {
    createAssistant() {
        return __awaiter(this, void 0, void 0, function* () {
            const file = yield openai.files.create({
                file: fs.createReadStream('assets/Start Up Information.csv'),
                purpose: 'assistants'
            });
            const assistant = yield openai.beta.assistants.create({
                name: 'Investor Assistant',
                description: 'You are tasked to suggest investors with 3 best possible startups from the csv dataset to invest in based on their preferences. You do not have to match all the criterias. You can provide other possible alternatives as well',
                model: 'gpt-3.5-turbo',
                tools: [{ "type": "code_interpreter" }],
                tool_resources: {
                    "code_interpreter": {
                        "file_ids": [file.id]
                    }
                }
            });
            return assistant;
        });
    }
    createThreads(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const thread = yield openai.beta.threads.create();
            yield openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: content
            });
            return thread;
        });
    }
    createThreadsSummarize(company_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const thread = yield openai.beta.threads.create();
            yield openai.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: `Explain the company where Company_Name = ${company_name} and Investment_Date = the latest date in a paragraph using its data. Do it in 80 words or less`
            });
            return thread;
        });
    }
    promptAssistant(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const { minimumBudget, maximumBudget, industryField, 
            // companySize,
            // state,
            companyType, companyMaturity, } = content;
            const prompt = `I am looking for a company around the ${industryField} industry. 
                        I prefer a company in their ${companyMaturity} funding rounds and is a ${companyType} company focus.
                        List the names of the top 5 companies that are similar to my preferences.
                        Answer in 10 words or less.`;
            const assistantId = (yield this.createAssistant()).id;
            const threadId = (yield this.createThreads(prompt)).id;
            const run = yield openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
            const retrieveRun = () => __awaiter(this, void 0, void 0, function* () {
                let keepRetrievingRun;
                while (run.status !== 'completed') {
                    keepRetrievingRun = yield openai.beta.threads.runs.retrieve(threadId, run.id);
                    if (keepRetrievingRun.status === 'completed') {
                        break;
                    }
                }
            });
            yield retrieveRun();
            const allMessages = yield openai.beta.threads.messages.list(threadId);
            const responseText = allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
            // const jsonStart = responseText.indexOf('[');
            // const jsonEnd = responseText.lastIndexOf(']') + 1;
            // let jsonData = responseText.substring(jsonStart, jsonEnd);
            // jsonData = jsonData.replace(/\\n/g, '').replace(/\\"/g, '"');
            const startupCompany = new startupCompany_1.default();
            const companyNames = yield startupCompany.getCompanyNameFromApiResponse(responseText);
            const result = yield startupCompany.getCompanyInfoFromExcel(companyNames);
            console.log(responseText);
            console.log(companyNames);
            return result;
        });
    }
    promptAssistantSummarize(company_name) {
        return __awaiter(this, void 0, void 0, function* () {
            const assistantId = (yield this.createAssistant()).id;
            const threadId = (yield this.createThreadsSummarize(company_name)).id;
            const run = yield openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
            const retrieveRun = () => __awaiter(this, void 0, void 0, function* () {
                let keepRetrievingRun;
                while (run.status !== 'completed') {
                    keepRetrievingRun = yield openai.beta.threads.runs.retrieve(threadId, run.id);
                    if (keepRetrievingRun.status === 'completed') {
                        break;
                    }
                }
            });
            yield retrieveRun();
            const allMessages = yield openai.beta.threads.messages.list(threadId);
            return allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
        });
    }
    promptAssistantChatbot(content) {
        return __awaiter(this, void 0, void 0, function* () {
            const assistantId = (yield this.createAssistant()).id;
            const threadId = (yield this.createThreads(content)).id;
            const run = yield openai.beta.threads.runs.create(threadId, { assistant_id: assistantId });
            const retrieveRun = () => __awaiter(this, void 0, void 0, function* () {
                let keepRetrievingRun;
                while (run.status !== 'completed') {
                    keepRetrievingRun = yield openai.beta.threads.runs.retrieve(threadId, run.id);
                    if (keepRetrievingRun.status === 'completed') {
                        break;
                    }
                }
            });
            yield retrieveRun();
            const allMessages = yield openai.beta.threads.messages.list(threadId);
            return allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
        });
    }
}
exports.default = OpenAIService;
