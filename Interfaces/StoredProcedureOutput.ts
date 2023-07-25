export default interface StoredProcedureOutput {
    Number: number,
    Body: {
        Procedure: string,
        State: string,
        Message: string | {};
    }
}