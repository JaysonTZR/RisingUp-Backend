"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// const handleWebSocketConnection = (io: Server) => {
//     io
//         .on('connection', (socket) => {
//             socket.on('prompt', async (request) => {
//                 const { content, threadId, userId } = request;
//                 const response = await new OpenAIService().promptAssistant(socket);
//                 const stream = response;
//                 await socketUtils.readStream(stream.getReader(), socket);
//             });
//         })
//         .on('error', (err) => {
//             console.error('Failed to establish a connection', err);
//         });
// };
// export default {
//     handleWebSocketConnection,
// };
