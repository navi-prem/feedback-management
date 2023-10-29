"use client"

import { FormEvent, useState , useEffect } from "react"

import { question, questionNset } from "@/lib/types"
import Image from 'next/image'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

import CreateIcon from '@mui/icons-material/Create';
import CloseIcon from '@mui/icons-material/Close';

const QuestionEdit = ( data : questionNset ) => {

    const[question,setQuestion]=useState(data.question)
    const[img_url,setImg_url]=useState(data.img_url)
    const[options,setOptions]=useState(data.options)
    const[required,setRequired]=useState(data.required)
    const[tempOption,setTempOption]=useState("")

    const { toast } = useToast()

    const deleteOption = (idxToDelete:number) => {
        if(options.length == 1) {
            toast({
                variant : "destructive",
                title : "A qestion should at least have one option"
            })
        }else{
            const updatedOptions = options.filter((item, index) => index !== idxToDelete);
            setOptions(updatedOptions);
        }
    }

    const addOption = (e : FormEvent ) => {
        e.preventDefault()
        if(tempOption.length != 0) {
            const newOption = {
                option : tempOption ,
                id : options.length
            }
            setOptions([...options,newOption])
            setTempOption("")
        }else{
            toast({
              variant : "destructive",
              title: "An option cannot be empty!",
            })
        }
    }

    const saveChanges = () => {
        if(question.length !=0 && options.length != 0) {
            if(data.question.length >= 1 && data.options.length >= 1) {
                data.setQuestions((prev)=>{
                    const idxToUpdate = prev.findIndex( ele => ele.id == data.id )
                    if( idxToUpdate !== -1 ) {
                        const updatedQuestions = [...prev];
                        updatedQuestions[idxToUpdate].options = options
                        updatedQuestions[idxToUpdate].question = question
                        updatedQuestions[idxToUpdate].required = required
                        updatedQuestions[idxToUpdate].img_url = img_url
                        return updatedQuestions;
                    }
                    return prev;
                })
                toast({
                  title: "Question Updated Sucessfully",
                })
            }else{
                toast({
                  title: "Question added Successfully!",
                })
                const newQuestion = {
                    id : 10,
                    question,
                    img_url,
                    required,
                    is_answer : false,
                    options
                }
                data.setQuestions((prev)=>[...prev,newQuestion])
            }
        }
        else
            toast({
              variant : "destructive",
              title: "Question is Incomplete!",
              description: "Your Question and answer should be valid",
            })
    }

    return(<>
        <DialogHeader>
            <DialogTitle>Edit Question</DialogTitle>
            <DialogDescription>
                Make changes to your Question here. Click save when you&apos;re done.
            </DialogDescription>
        </DialogHeader>
        <div className="flex justify-between my-2">
            <Label>Question {data.id+1}</Label>
            <div className="flex items-center">
                <Switch
                    checked={required}
                    onCheckedChange={()=>setRequired((prev)=>!prev)}
                />
                <Label className="ml-2">Required</Label>
            </div>
        </div>
        <Textarea placeholder="Your Question here" className="resize-none" value={question} onChange={(e)=>setQuestion(e.target.value)}/>
        <div className="my-2">
            <Label>Enter image URL</Label>
            <Input className="mt-2" value={img_url} onChange={(e)=>setImg_url(e.target.value)}/>
        </div>
        <div>
            <Label>Options</Label>
            <div className="mt-2 w-60">
                {
                    options.map((ele,idx)=>{
                        return(<div key={ele.id}>
                            <CloseIcon fontSize="small" onClick={()=>deleteOption(idx)}/> <Button variant="outline" className="my-1">{ele.option}</Button>
                        </div>)
                    })
                }
                <form>
                    <Input value={tempOption} onChange={(e)=>setTempOption(e.target.value)} />
                    <Button className="my-2" type="submit" onClick={(e)=>addOption(e)}>Add Option</Button>
                </form>
            </div>
        </div>
        <DialogFooter>
            <Button onClick={()=>saveChanges()}>Save changes</Button>
        </DialogFooter>
    </>)
}

const Question = ( data : questionNset ) => {

    return(<Dialog>
         <div className="flex justify-between my-2">
            <div className="flex items-center">
                <Label>Question {data.id+1}</Label>
                <DialogTrigger asChild>
                    <CreateIcon fontSize="small" className="mx-2 cursor-pointer"/>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <QuestionEdit {...data}/>
                </DialogContent>
            </div>
            <div className="flex items-center">
                { data.required ? <Badge variant="destructive">Required</Badge> : <Badge variant="outline">Optional</Badge> }
            </div>
        </div>
        <div className="text-base font-medium leading-none">{data.question}</div>
            <div className="my-2">
                {data.img_url.length > 10 && <Image src={data.img_url} alt="Image" width={500} height={500} priority/> }
            </div>
            <div>
                <Label>Options</Label>
                <div className="mt-2 w-60">
                {
                    data.options.map((ele)=>{
                        return(<div key={ele.id}>
                            <Button variant="outline" className="my-1">{ele.option}</Button>
                        </div>)
                    })
                }
            </div>
        </div>
    </Dialog>)
}

const Home = () => {

    const[questions,setQuestions] = useState<Array<question>>([{
        id : 0 ,
        question : "This is a Demo question?",
        img_url : "https://s3.amazonaws.com/images.seroundtable.com/google-black-1545140719.jpg",
        required : false,
        is_answer : false,
        options : [
            {
                option : "Option 1",
                id : 0
            },{
                option : "Option 2",
                id : 1
            }
        ]
    }])

    // useEffect(()=>{
    //     if (questions.length != 1)
    //         localStorage.setItem("pastQues",JSON.stringify(questions))
    // },[questions])
    //
    // useEffect(()=>{
    //     const data = localStorage.getItem("pastQues") || ""
    //     data != "" && setQuestions(JSON.parse(data))
    // },[])

    const demoQuestion = {
        id : questions.length ,
        question : "",
        img_url : "",
        required : false,
        is_answer : false,
        setQuestions : setQuestions,
        options : []
    }

    return(<Dialog>
        <div className="flex justify-center w-full mt-5">
            <div className="w-[85vw]">
                {
                    questions?.map((ele,idx)=>{
                        return (<div key={idx}>
                            <Question {...{...ele,setQuestions}}/>
                        </div>)
                    })
                }
                <DialogTrigger asChild>
                    <Button className="mt-2">Add Question</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <QuestionEdit {...demoQuestion}/>
                </DialogContent>
            </div>
        </div>
    </Dialog>)
}
export default Home;
