export class Video {
    constructor(
        private id: string,
        private title: string, 
        private duration: number,
        private createdAt: string
    ){}
    public getId(): string{
        return this.id
    }
    public setId(newValue: string): void{
        this.id = newValue
    }
    public getTitle(): string{
        return this.title
    }
    public setTitle(newValue: string): void{
        this.title = newValue
    }
    public getDuration(): number{
        return this.duration
    }
    public setDuration(newValue: number): void{
        this.duration = newValue
    }
    public getCreatedAt(): string {
        return this.createdAt
    }
    
    public setCreatedAT(newValue: string): void {
        this.createdAt = newValue
    }
}