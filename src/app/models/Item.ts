export class Item {
    id: string | undefined;
    name: string | undefined;
    category: string | undefined;
    created: Date | undefined;
    location: string | undefined;
    description: string | undefined;
    imageId: string | undefined;
    userId: number | undefined;
    additionalData: Map<string, string> = new Map<string, string>();
    constructor(
        id?: string,
        name?: string,
        category?: string,
        description?: string,
        imageId?: string,
        userId?: number,
        created: Date = new Date(),
        location: string = "",
        additionalData: Map<string, string> = new Map<string, string>()
    ) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.description = description;
        this.imageId = imageId;
        this.userId = userId;
        this.created = created;
        this.location = location;
        this.additionalData = additionalData;
    }

    public static fromJSON(json: any): Item {
        const item = Object.assign(Item.builder().build(), json);
        if (json.additionalData && !(json.additionalData instanceof Map)) {
            item.additionalData = new Map(Object.entries(json.additionalData));
        } else if (!item.additionalData) {
            item.additionalData = new Map<string, string>();
        }
        return item;
    }

    public static builder(): ItemBuilder {
        return new ItemBuilder();
    }

    public clone(): Item {
        return new Item(
            this.id,
            this.name,
            this.category,
            this.description,
            this.imageId,
            this.userId,
            this.created,
            this.location,
            new Map(this.additionalData || new Map())
        );
    }

    public toJSON(): any {
        return {
            ...this,
            additionalData: Object.fromEntries(this.additionalData)
        };
    }
}

export class ItemBuilder {
    private item: Item = new Item();

    public withId(id: string | undefined): ItemBuilder {
        this.item.id = id;
        return this;
    }

    public withName(name: string | undefined): ItemBuilder {
        this.item.name = name;
        return this;
    }

    public withCategory(category: string | undefined): ItemBuilder {
        this.item.category = category;
        return this;
    }

    public withDescription(description: string | undefined): ItemBuilder {
        this.item.description = description;
        return this;
    }

    public withImageId(imageId: string | undefined): ItemBuilder {
        this.item.imageId = imageId;
        return this;
    }

    public withUserId(userId: number | undefined): ItemBuilder {
        this.item.userId = userId;
        return this;
    }

    public withCreated(created: Date | undefined): ItemBuilder {
        this.item.created = created;
        return this;
    }

    public withLocation(location: string | undefined): ItemBuilder {
        this.item.location = location;
        return this;
    }

    public withAdditionalData(additionalData: Map<string, string>): ItemBuilder {
        this.item.additionalData = additionalData;
        return this;
    }

    public withProperty<K extends keyof Item>(key: K, value: Item[K]): ItemBuilder {
        (this.item as any)[key] = value;
        return this;
    }

    public build(): Item {
        return this.item.clone();
    }
}