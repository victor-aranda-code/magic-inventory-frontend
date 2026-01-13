export class Item {
    id: number;
    name: string;
    category: string;
    created: Date;
    location: string;
    description: string;
    imageId: string;
    userId: number;
    additionalData: Map<string, string>;
    constructor(
        id: number,
        name: string,
        category: string,
        description: string,
        image: string = "",
        userId: number = 0,
        created: Date = new Date(),
        location: string = "",
        additionalData: Map<string, string> = new Map<string, string>()
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.imageId = image;
        this.userId = userId;
        this.created = created;
        this.location = location;
        this.additionalData = additionalData;
    }

}