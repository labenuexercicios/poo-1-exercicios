import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './database/knex'
import { TVideoDB } from './types'
import { Video } from './models/Video'

const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
    console.log(`Servidor rodando na porta ${3003}`)
})

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

app.get("/videos", async (req: Request, res: Response)=>{
    try {
        const q = req.query.q

        let videoDB

        if (q) {
            const result: TVideoDB[] = await db("videos").where("title", "LIKE", `%${q}%`)
            videoDB = result
        } else {
            const result: TVideoDB[] = await db("videos")
            videoDB = result
        }

        const videos: Video[] = videoDB.map((video)=>
            new Video (
                video.id,
                video.title,
                video.time_seconds,
                video.date_upload
            )
        )

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

app.post("/videos", async (req: Request, res: Response)=>{
    try {
        const {id, title, timeSeconds} = req.body
        
        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser string")
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser string")
        }

        if (typeof timeSeconds !== "string") {
            res.status(400)
            throw new Error("'timeSeconds' deve ser string")
        }

        const [videoDBExists]: TVideoDB[] | undefined[] = await db("videos").where({id})

        if (videoDBExists) {
            res.status(400)
            throw new Error("'id' já existe")
        }

        const newVideo = new Video (
            id,
            title,
            timeSeconds,
            new Date().toISOString()
        )

        const newVideoDB: TVideoDB = {
            id: newVideo.getId(),
            title: newVideo.getTitle(),
            time_seconds: newVideo.getTimeSeconds(),
            date_upload: newVideo.getDateUpload()
        }

        await db("videos").insert(newVideoDB)

        const [videoDB] = await db("videos").where({id})

        res.status(201).send({message: `Vídeo: ${videoDB.title} , adicionado com sucesso.`})

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

app.put("/videos/:id", async (req: Request, res: Response)=>{
    try {
        const id = req.params.id
        const {title, timeSeconds, dateUpload} = req.body

        if(typeof id === undefined){
            res.status(400)
            throw new Error("'id' não informada.");
            
        }

        if (typeof title !== "string") {
            res.status(400)
            throw new Error("'title' deve ser uma string");
            
        }

        if (typeof timeSeconds !== "string") {
            res.status(400)
            throw new Error("'timeSeconds' deve ser uma string");
            
        }

        if (typeof dateUpload !== "string") {
            res.status(400)
            throw new Error("'dateUpload' deve ser uma string");
            
        }

        const [videoDB]: TVideoDB[] | undefined[] = await db("videos").where({id})

        if (!videoDB) {
            res.status(404)
            throw new Error("'id' não encontrado no banco de dados");
            
        } else {
            const updateVideo = {
                title: title || videoDB.title,
                time_seconds: timeSeconds || videoDB.time_seconds,
                date_upload: dateUpload || videoDB.date_upload
            }

            await db("videos").update({updateVideo}).where({id})
        }

        res.status(200).send({message: "Atualização realizada com sucesso", video: {videoDB}})
        
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

app.delete("/videos/:id", async (req: Request, res: Response)=>{
    try {
        const id = req.params.id

        if (typeof id !== "string") {
            res.status(400)
            throw new Error("'id' deve ser uma string");
        }

        const [videoDB]: TVideoDB[] | undefined[] = await db("videos").where({id})

        if (!videoDB) {
            res.status(404)
            throw new Error("'id' não encontrado no banco de dados");
            
        } else {
            await db("videos").delete().where({ id })
        }

        res.status(200).send({message: "Vídeo deletado com sucesso."})

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