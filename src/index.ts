import express, { Request, Response} from 'express';
import cors from 'cors';
import { VideoDatabase } from './database/VideoDatabase';
import { Tvideo } from './database/types';
import { Video } from './database/models/Video'

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Pong!");
});

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q as string

        const videoDatabase = new VideoDatabase();
        const videosDB = await videoDatabase.findVideos(q)

        const videos: Video[] = videosDB.map((videoDB) => new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.created_at
        ));

        res.status(200).send(videos);
    } catch (error) {
        console.log(error);

        if (res.statusCode === 200) {
            res.status(500);
        }

        if (error instanceof Error) {
            res.send(error.message);
        } else {
            res.send("Erro inesperado");
        }
    }
});

app.post("/videos", async (req: Request, res: Response) => {
    try {
        const { id, title, duration } = req.body

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof duration !== "number") {
            res.status(400)
            throw new Error("'duration' deve ser string")
        }

        // const [ videoDBExists ]: Tvideo[] | undefined[] = await db("videos").where({ id })
        
        const videoDatabase = new VideoDatabase()
        const videoDBExists = await videoDatabase.findVideoById(id)

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const video = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        const newVideo: Tvideo = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            created_at: video.getCreatedAt()
        }

        // await db("videos").insert(newVideo)
        await videoDatabase.insertVideo(newVideo)

        res.status(201).send(newVideo)
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.put("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToEdit = req.params.id;

        const id = req.body.id;
        const title = req.body.title;
        const duration = req.body.duration;        

/*         const [videoDB] = await db("videos").where({ id: idToEdit })
 */        const videoDatabase = new VideoDatabase()
           const videoIdToEdit = await videoDatabase.findVideoById(id)

        if(!videoIdToEdit){
            res.status(400)
            throw new Error("'id' não existe")
        }

        const video = new Video (
            videoIdToEdit.id,
            videoIdToEdit.title,
            videoIdToEdit.duration,
            videoIdToEdit.created_at
        )

        if(id !== undefined){
            if (typeof id !== "string") {
                res.status(400)
                throw new Error("'newId' deve ser string")
            }
        }

        if(title !== undefined){
            if (typeof title !== "string") {
                res.status(400)
                throw new Error("'newTitulo' deve ser string")
            }
        }

        if(duration !== undefined){
            if (typeof duration !== "number") {
                res.status(400)
                throw new Error("'newDuracao' deve ser number")
            }
        }

        id && video.setId(id)
        title && video.setTitle(title)
        duration && video.setDuration(duration)

        const newVideo: Tvideo = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            created_at: video.getCreatedAt()
        }

        await videoDatabase.updateVideo(id, title, duration);

        res.status(200).send({message: "Video atualizado com sucesso", newVideo})

    } catch (error) {

    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToDelete = req.params.id

        // const [videoDB] = await db("videos").where({ id: idToDelete })
        const videoDatabase = new VideoDatabase();
        const videoToDelete = await videoDatabase.findVideoById(idToDelete);
    
        if (!videoToDelete) {
            throw new Error("Vídeo com o ID fornecido não foi encontrado.");
        }
    

        if(!videoToDelete){
            res.status(400)
            throw new Error("'id' não existe")
        }

        const video = new Video (
            videoToDelete.id,
            videoToDelete.title,
            videoToDelete.duration,
            videoToDelete.created_at
        )

        // await db('videos').delete().where({id: video.getId()})
        await videoDatabase.deleteVideo(idToDelete)

        res.status(200).send({message: "Video deletado com sucesso"})

    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

