import { storageService } from './async-storage-service.js'


export const bugService = {
  query,
  getById,
  getEmptyBug,
  save,
  remove,
  createPDF
}
const BASE_URL = `/api/bug/` 

// LIST
function query(filterBy) {
  return axios.get(BASE_URL,{ params: filterBy }).then(res => res.data)
}

// READ
function getById(bugId) {
  return axios.get(BASE_URL + bugId)
  .then(res => res.data)  
}


// ADD UPDATE 
function save(bug) {

  if (bug._id) {
    return axios.put(BASE_URL + bug._id, bug).then((res) => res.data)
   
  } else {
    return axios.post(BASE_URL, bug).then((res) => res.data)
    
  }

  // const url = BASE_URL + 'save'
  // var queryParams = `?title=${bug.title}&severity=${bug.severity}&description=${bug.description}`
  // if (bug._id) queryParams += `&_id=${bug._id}`
  
  // return axios.get(url + queryParams).then(res=>res.data)

}
function remove(bugId) {
  return axios.delete(BASE_URL + bugId).then((res) => res.data)
}

function createPDF(bugs){
  return axios.post('/api/pdf', bugs).then((res) => res.data)
}

function getEmptyBug() {
  return {
    title: '',
    severity: '',
  }
}
