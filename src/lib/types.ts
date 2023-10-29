export type question = {
    "id" : number,
    "question" : string,
    "img_url" : string,
    "required" : boolean,
    "is_answer" : boolean,
    "options" : Array<{
        "id" : number,
        "option" : string
    }>
}
export type questionNset = {
    "id" : number,
    "question" : string,
    "img_url" : string,
    "required" : boolean,
    "is_answer" : boolean,
    "setQuestions" : React.Dispatch<React.SetStateAction<Array<question>>>
    "options" : Array<{
        "id" : number,
        "option" : string
    }>
}
