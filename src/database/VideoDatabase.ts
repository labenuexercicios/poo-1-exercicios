import { Tvideo } from "./types";
import { BaseDatabase } from "./BaseDatabase";

export class VideoDatabase extends BaseDatabase {
    public static TABLE_VIDEOS = "videos";

    public async findVideos(q: string | undefined): Promise<Tvideo[]> {
        let videosDB: Tvideo[];
    
        if (q) {
            const result: Tvideo[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS)
                .where("title", "LIKE", `%${q}%`);
    
            videosDB = result;
        } else {
            const result: Tvideo[] = await BaseDatabase
                .connection(VideoDatabase.TABLE_VIDEOS);
            videosDB = result;
        }
    
        return videosDB;
    }

    public async findVideoById(id: string){
        const [ videoDB ]: Tvideo[] | undefined[] = await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where({ id })
            return videoDB;
    }

    public async videoIdToEdit(idToEdit: string){
        const [ videoDB ]: Tvideo[] | undefined[] = await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where({ idToEdit })
            return videoDB;
    }

    public async insertVideo(video: Tvideo): Promise<void> {
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .insert(video);
    }

    public async updateVideo(id: string, title: string, duration: number): Promise<void> {
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where({ id }) 
            .update({ title, duration })
    }

    public async deleteVideo(id: string): Promise<void> {
        await BaseDatabase
            .connection(VideoDatabase.TABLE_VIDEOS)
            .where({ id: id })
            .delete();
    }
    
}
