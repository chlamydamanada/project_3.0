export class BlogDbClass{
    createdAt: string
    constructor(public name: string,
                public description: string,
                public websiteUrl: string) {
        this.createdAt = new Date().toISOString()
    }
}