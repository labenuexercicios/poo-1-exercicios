import express, { Request, Response} from 'express';
import cors from 'cors';
import { db } from './database/knex';
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
        const q = req.query.q

        let videosDB: Tvideo[]

        if (q) {
            const result: Tvideo[] = await db("videos").where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: Tvideo[] = await db("videos")
            videosDB = result
        }

        const videos: Video[] = videosDB.map((videoDB) => new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.created_at
        ))

        res.status(200).send(videos)

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

        const [ videoDBExists ]: Tvideo[] | undefined[] = await db("videos").where({ id })

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

        await db("videos").insert(newVideo)
        const [ videoDB ]: Tvideo[] = await db("videos").where({ id })

        res.status(201).send(videoDB)
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
        const newId = req.body.newId;
        const newTitle = req.body.newTitle;
        const newDuration = req.body.newDuration;        

        const [videoDB] = await db("videos").where({ id: idToEdit })

        if(!videoDB){
            res.status(400)
            throw new Error("'id' não existe")
        }

        const video = new Video (
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.created_at
        )

        if(newId !== undefined){
            if (typeof newId !== "string") {
                res.status(400)
                throw new Error("'newId' deve ser string")
            }
        }

        if(newTitle !== undefined){
            if (typeof newTitle !== "string") {
                res.status(400)
                throw new Error("'newTitulo' deve ser string")
            }
        }

        if(newDuration !== undefined){
            if (typeof newDuration !== "number") {
                res.status(400)
                throw new Error("'newDuracao' deve ser number")
            }
        }

        newId && video.setId(newId)
        newTitle && video.setTitle(newTitle)
        newDuration && video.setDuration(newDuration)

        const newVideo: Tvideo = {
            id: video.getId(),
            title: video.getTitle(),
            duration: video.getDuration(),
            created_at: video.getCreatedAt()
        }

        await db('videos').update(newVideo).where({id: idToEdit})

        res.status(200).send({message: "Video atualizado com sucesso", newVideo})

    } catch (error) {

    }
})

app.delete("/videos/:id", async (req: Request, res: Response) => {
    try {

        const idToDelete = req.params.id

        const [videoDB] = await db("videos").where({ id: idToDelete })

        if(!videoDB){
            res.status(400)
            throw new Error("'id' não existe")
        }

        const video = new Video (
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.created_at
        )

        await db('videos').delete().where({id: video.getId()})

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

