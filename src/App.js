import { useState } from "react";
import axios from "axios";
import *  as XLSX from "xlsx"


function App() {

  const [msg, setmsg] = useState("")
  const [status, setstatus] = useState(false)
  const [emailList, setemaillist]= useState([])


  function handlemsg(evt){
    setmsg(evt.target.value)
  }
  function handlefile(evt){
    const file = evt.target.files[0];
    console.log(file)
    
    const reader = new FileReader()
    reader.onload = function(evt)
    {
        const data = evt.target.result
        console.log(data);
        const workbook = XLSX.read(data, {type:"binary"})
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName]
        const emailList = XLSX.utils.sheet_to_json(worksheet,{header:'A'})
        const totalemail = emailList.map(function(item){return item.A})
        console.log(totalemail);
        setemaillist(totalemail)
    }
    reader.readAsArrayBuffer(file)

  }

  function send(){
    setstatus(true)
axios.post("https://bukmail-backend.vercel.app/sendmail", {msg:msg, emailList:emailList}).then(function(data){
  if(data.data === true)
  {
    alert("Email sent sucessfully")
    setstatus(false)
  }
  else{
    alert("Failed")
  }
})

  }
  return (
    <div>
      <div className="bg-blue-950 text-white text-center">
      <h1 className="text-2xl font-medium px-5 py-3">Bulk mail</h1>
      </div>


      <div className="bg-blue-800 text-white text-center">
      <h1 className="font-medium px-5 py-3">We can help you to send bulk email at once</h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
      <h1 className="font-medium px-5 py-3">Drag and drop</h1>
      </div>

<div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
  <textarea className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md" placeholder="Enter the email text..." onChange={handlemsg}value = {msg}></textarea>
  <div>
    <input type = "file" className="border-4 border-dashed py-4 px-4 mt-5 mb-5" onChange={handlefile}></input>
  </div>
  <p>Total email in the file: {emailList.length}</p>


  <button className="bg-blue-950 py-2 px-2  text-white font-medium rounded-md w- mt-2" onClick={send}>{status?"sending...":"Send"}</button>
</div>
     <div className="bg-blue-300 text-white text-center p-8">
      </div>
      <div className="bg-blue-200 text-white text-center p-8">
      </div>

    </div>
  );
}

export default App;
