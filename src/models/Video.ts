export class Video {
    
    constructor(
        private id: string,
        private title: string,
        private timeSeconds: string,
        private dateUpload: string
    ){}

    public getId(): string {
        return this.id;
    }
    
    public setId(value: string): void {
        this.id = value;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(value: string): void {
        this.title = value;
    }

    public getTimeSeconds(): string {
        return this.timeSeconds;
    }

    public setTimeSeconds(value: string): void {
        this.timeSeconds = value;
    }

    public getDateUpload(): string {
        return this.dateUpload;
    }

    public setDateUpload(value: string): void {
        this.dateUpload = value;
    }
}