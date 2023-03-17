import { io, Socket } from 'socket.io-client';

export interface IWorkerProps {}

addEventListener('message', (event: MessageEvent<IWorkerProps>) => { })
removeEventListener("message", () => { });


export { };