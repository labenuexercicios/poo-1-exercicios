import  express, {Request, Response}  from "express";
import cors from 'cors';
import { TVideoDB } from './types'
import { db } from './database/knex'
import { Video } from './models/Video'

const app = express();

app.use(express.json());
app.use(cors());

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003");
});

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
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

app.get("/videos", async (req: Request, res: Response) => {
    try {
        const q = req.query.q

        let videosDB

        if (q) {
            const result: TVideoDB[] = await db("videos").where("title", "LIKE", `%${q}%`)
            videosDB = result
        } else {
            const result: TVideoDB[] = await db("videos")
            videosDB = result
        }
                 
        const videos: Video[] = videosDB.map((videoDB)=> new Video(
            videoDB.id,
            videoDB.title,
            videoDB.duration,
            videoDB.upload_date
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
            throw new Error("'duration' deve ser number")
        }

        const [ videoDBExists ]: TVideoDB[] | undefined[] = await db("videos").where({ id })

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        //1 - INSTANCIAR os dodos vindos do body
        const newVideo = new Video(
            id,
            title,
            duration,
            new Date().toISOString()
        )

        //2 - Objeto simples para MODELAR as informações para o banco de dados
        const newVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            duration: newVideo.getDuration() 
        }

        await db("videos").insert(newVideoDB)
     
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



  