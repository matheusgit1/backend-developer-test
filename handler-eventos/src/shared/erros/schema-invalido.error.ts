export class SchemaInvalido extends Error {
    public readonly dados?: any
    constructor(message: string, dados?: any) {
        super(message)
        this.dados = dados
    }
}