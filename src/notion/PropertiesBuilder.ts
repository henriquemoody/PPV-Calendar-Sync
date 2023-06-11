export default class PropertiesBuilder {
    private readonly properties: object;

    constructor() {
        this.properties = {};
    }

    title(property: string, content: string): this {
        this.properties[property] = {
            type: 'title',
            title: [
                {
                    type: 'text',
                    text: {
                        content: content,
                    },
                },
            ],
        };

        return this;
    }

    richText(property: string, content: string): this {
        this.properties[property] = {
            type: 'rich_text',
            rich_text: [
                {
                    text: {
                        content: content,
                    },
                },
            ],
        };

        return this;
    }

    date(property: string, start: string, end?: string): this {
        this.properties[property] = {
            type: 'date',
            date: {
                start: start,
                ...(start.length > 10 ? {time_zone: 'Europe/Berlin'} : {}),
                ...(end ? {end: end} : {}),
            },
        };

        return this;
    }

    select(property: string, name: string): this {
        this.properties[property] = {
            select: {
                name: name,
            },
        };

        return this;
    }

    relation(property: string, relations: Array<string>): this {
        this.properties[property] = {
            relation: relations.map((relation) => {
                return {
                    id: relation,
                };
            }),
        };

        return this;
    }

    number(property: string, number: number): this {
        this.properties[property] = {
            number: number,
        };

        return this;
    }

    build(): object {
        return this.properties;
    }
}