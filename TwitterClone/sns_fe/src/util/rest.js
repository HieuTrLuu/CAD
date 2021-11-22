import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

let AZURE_FN = 'https://cloudcw1.azurewebsites.net'
let AZURE_FN_DEV = 'http://localhost:7071/api/'
let READ_USER_DB = 'ReadFromDB';
let GET_USER_BY_USERNAME = 'GetUserByUserName'
let WRITE_USER_DB = 'Write2DB';
export const axiosInstance = axios.create({
    baseURL: AZURE_FN_DEV,
    headers: {
        // "Content-Type": "application/vnd.itinno.v"+"0.1"+"+json",
        "Cache-Control": "no-cache,no-store,must-revalidate,max-age=-1,private",
    },
    data: {}
});


export function getUserById(id){
    return axiosInstance.get(`${READ_USER_DB}?ID=${id}`).
        then(res => {
            // console.log(res.data) 
            return res.data

        }).catch(err => {
            // console.log(err.data) ;
            return ;
        });    
}

export function getUserByUserName(userName){
    return axiosInstance.get(`${GET_USER_BY_USERNAME}?userName=${userName}`).
        then(res => {
            // console.log(res.data) 
            return res.data

        }).catch(err => {
            // console.log(err.data) ;
            return ;
        });    
}

export function submitTwit(userName, userId, text, imgUrl){
    // console.log(`text:${text}`);
    // console.log(`url:${imgUrl}`);
    return axiosInstance.post(`SubmitTwit`, {'userName': userName,'userId': userId,'text': text, 'imageUrl':imgUrl, time:`${Date.parse(Date())}`}).
        then(res =>{
            console.log(res);
        }).catch(err =>{
            console.log('Unable to write twit to DB');
            console.log(err);
        });
}

export function getTwitsByUserId(id){
    return axiosInstance.get(`TwitQuery?ID=${id}`)
        .then(res =>{
            console.log(res);
        }).catch(err =>{
            console.log('Unable to write twit to DB');
            console.log(err);
        });
}

export function getAllTwits(){
    return axiosInstance.get(`AllTwit`)
        .then(res =>{
            // console.log(`get all twit ${res}`);
            return res.data
        }).catch(err =>{
            console.log('Unable to write twit to DB');
            console.log(err);
        });
}


export function setFollowingStatus(email, userEmail2Follow, bool){
    return axiosInstance.post(`${WRITE_USER_DB}?email=${email}&email2=${userEmail2Follow}`,
                        {email:`${email}`, userEmail2Follow:`${userEmail2Follow}`, status:bool, isCreateUser:false})
    .then(res=>{
        console.log(`setFollowing state` + JSON.stringify(res.data));
    }).catch(err=>{
        console.log(`setFollowing state error` + JSON.stringify(err));
    })

}

// How to read from DB: axiosInstance.get(`/ReadFromDB?ID=${testUserID}`).then(res=>{console.log(res.data)});
// How to write to DB: axiosInstance.post("/changepassword", {
//      content:{}
//     newPassword: newPassword,
//     repeatPassword: repeatPassword
// })