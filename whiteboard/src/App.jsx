import Whiteboard from "./Whiteboard/Whiteboard"
import {connectWithSocketServer} from "./socketConn/socketConn"
import { useEffect } from "react"; 


function App() {
  useEffect(() => {
    connectWithSocketServer();  
  }, []);
  return (
    <>
      <Whiteboard />        
    </>
  )
}

export default App
