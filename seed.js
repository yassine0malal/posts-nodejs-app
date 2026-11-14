const https = require("https");
const fs = require("fs");
let jsonFile = require("jsonfile");

const API_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchPosts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(`Eror------> ${response.status} `)
        }

        const data = await response.json();
        savePosts(data)
        // console.log("data: ", JSON.stringify(data));
    } catch (error){
        console.log("Error === " + error)
    }
}


function savePosts(posts) {
    arr = []
    console.log("posts : ",posts.length)
    posts.forEach((element) => {
        arr.push({
            id :element.id,
            userId:element.userId,
            title:element.title,
            body:element.body
        });
    });
    fs.writeFileSync("posts.json",JSON.stringify(arr,null,4),"utf-8")

}

fetchPosts()
