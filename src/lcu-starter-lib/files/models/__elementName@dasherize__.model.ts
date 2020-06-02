export class <%= classify(elementName) %>Model {
    public <%= classify(elementName) %>Id: number;
    public Content: string;
    public Icon: string;
    public Loading?: boolean;
    public Subtitle: string;
    public Title: string;
    public Url?: string;
}
