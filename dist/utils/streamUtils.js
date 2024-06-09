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
Object.defineProperty(exports, "__esModule", { value: true });
const readStream = (reader, socket) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { done, value } = yield reader.read();
        if (done)
            return;
        const text = JSON.parse(new TextDecoder().decode(value));
        if (text.event === 'thread.message.delta') {
            const textChunk = text.data.delta.content[0].text.value;
            socket.emit('response chunk', textChunk);
        }
        yield readStream(reader, socket);
    }
    catch (error) {
        console.error('Error reading stream:', error);
        socket.emit('response chunk error', error);
    }
});
exports.default = {
    readStream,
};
