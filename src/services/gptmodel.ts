import OpenAI from "openai";
import fs = require('fs');
import { IAIPrompt } from "../entities/gptmodel";
import StartupCompanyService from "./startupCompany";

const openai = new OpenAI({ apiKey: '...' });

export default class OpenAIService {
    async createAssistant(): Promise<OpenAI.Beta.Assistants.Assistant> {
        const file = await openai.files.create({
            file: fs.createReadStream('assets/Start Up Information.csv'),
            purpose: 'assistants'
        })

        const assistant = await openai.beta.assistants.create({
            name: 'Investor Assistant',
            description: 'You are tasked to suggest investors with 3 best possible startups from the csv dataset to invest in based on their preferences. You do not have to match all the criterias. You can provide other possible alternatives as well',
            model: 'gpt-3.5-turbo',
            tools: [{ "type": "code_interpreter" }],
            tool_resources: {
                "code_interpreter": {
                    "file_ids": [file.id]
                }
            }
        })

        return assistant;
    }   

    async createThreads(content: string): Promise<OpenAI.Beta.Threads.Thread> {
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: content
        });

        return thread;
    }

    async createThreadsSummarize(company_name: string): Promise<OpenAI.Beta.Threads.Thread> {
        const thread = await openai.beta.threads.create();

        await openai.beta.threads.messages.create(thread.id, {
            role: 'user',
            content: `Explain the company where Company_Name = ${company_name} and Investment_Date = the latest date in a paragraph using its data. Do it in 80 words or less`
        });

        return thread;
    }

    async promptAssistant(content: IAIPrompt) {
        const {
            minimumBudget,
            maximumBudget,
            industryField,
            // companySize,
            // state,
            companyType,
            companyMaturity,
        } = content;

        const prompt = `I am looking for a company around the ${industryField} industry. 
                        I prefer a company in their ${companyMaturity} funding rounds and is a ${companyType} company focus.
                        List the names of the top 5 companies that are similar to my preferences.
                        Answer in 10 words or less.`
        
        const assistantId = (await this.createAssistant()).id;
        const threadId = (await this.createThreads(prompt)).id;

        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId })

        const retrieveRun = async() => {
            let keepRetrievingRun;

            while (run.status !== 'completed') {
                keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, run.id)

                if (keepRetrievingRun.status === 'completed') {
                    break;
                }
            }
        }

        await retrieveRun();

        const allMessages = await openai.beta.threads.messages.list(threadId);

        const responseText = allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
        // const jsonStart = responseText.indexOf('[');
        // const jsonEnd = responseText.lastIndexOf(']') + 1;
        // let jsonData = responseText.substring(jsonStart, jsonEnd);

        // jsonData = jsonData.replace(/\\n/g, '').replace(/\\"/g, '"');

        const startupCompany = new StartupCompanyService();
        const companyNames = await startupCompany.getCompanyNameFromApiResponse(responseText)
        const result = await startupCompany.getCompanyInfoFromExcel(companyNames);
        console.log(responseText);
        console.log(companyNames);

        return result;
    }

    async promptAssistantSummarize(company_name: string) {
        const assistantId = (await this.createAssistant()).id;
        const threadId = (await this.createThreadsSummarize(company_name)).id;

        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId })

        const retrieveRun = async() => {
            let keepRetrievingRun;

            while (run.status !== 'completed') {
                keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, run.id)

                if (keepRetrievingRun.status === 'completed') {
                    break;
                }
            }
        }

        await retrieveRun();

        const allMessages = await openai.beta.threads.messages.list(threadId);

        return allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
    }

    async promptAssistantChatbot(content: string) {
        const assistantId = (await this.createAssistant()).id;
        const threadId = (await this.createThreads(content)).id;

        const run = await openai.beta.threads.runs.create(threadId, { assistant_id: assistantId })

        const retrieveRun = async() => {
            let keepRetrievingRun;

            while (run.status !== 'completed') {
                keepRetrievingRun = await openai.beta.threads.runs.retrieve(threadId, run.id)

                if (keepRetrievingRun.status === 'completed') {
                    break;
                }
            }
        }

        await retrieveRun();

        const allMessages = await openai.beta.threads.messages.list(threadId);

        return allMessages.data[0].content[0].type === 'text' ? allMessages.data[0].content[0].text.value : '';
    }
}