import { selectSettingsByUser } from '@/utils/db/settings';
import { isZapError } from '@/utils/zap';
import { getProgressPlan, IPlanProgress } from '@/utils/zap/plan';
import { Settings } from '@prisma/client';
import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession, Session } from 'next-auth';
import { Server as IOServer, Server } from 'socket.io';
import { authOptions } from '../auth/[...nextauth]';

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

const main = (server: IOServer, session: Session) => {
  server.on("connection", (socket) => {


    socket.on("progress-plan", async (rawData: unknown) => {
       const { URLEndpoint, apiKey } = await selectSettingsByUser(session.user.email) as Settings; //get settings
       const { planId } = rawData as Omit<IPlanProgress, "apiKey">; //parsing
       const resp = await getProgressPlan(URLEndpoint, { apiKey, planId });
 
       //check
       if (!resp.ok) {
         throw new Error(resp.statusText);
       }
       const json = await resp.json();
 
       if (isZapError(json)) {
         throw new Error(json.message);
       }
 
       socket.emit("response-progress-plan", json);

    });
  });
}

const SocketHandler = async (req: NextApiRequest, res: NextApiResponseWithSocket) => {

  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    throw new Error("the session doesn't exist");
  }

  if (res.socket.server.io) {
    const server = res.socket.server.io;
    main(server, session);

  } else {
    const io = new Server(res.socket.server, { allowUpgrades: true })
    res.socket.server.io = io
    main(io, session);
  }

  res.end()
}

export default SocketHandler;