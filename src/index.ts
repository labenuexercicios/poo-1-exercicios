import express, { Request, Response} from 'express';
import cors from 'cors';
import { VideoDatabase } from './database/VideoDatabase';
import { Tvideo } from './database/types';
import { Video } from './models/Video'
import { VideoController } from './controller/VideoController';

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

const videoController = new VideoController()

app.get("/videos", videoController.getVideos)

app.post("/videos", videoController.createVideos)

app.put("/videos/:id", videoController.editVideosById)

app.delete("/videos/:id", videoController.deleteVideos)

