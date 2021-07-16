import axios from 'axios'

let getAssignment = async (assignmentId, token) =>{
    try {
        const response = await axios.post('http://localhost:3000/assignment/getAssignment',{
          assignmentId:assignmentId
        },{
          headers:{
            Authorization: token
          }
        }
        );
        return response.data
      } catch (error) {
        console.log(error)
        return error
        
      }
  }

export{
    getAssignment
}