const fs = require("fs")
const path = require("path")

const POST_FILES = path.join(__dirname, "posts.json");


function getAllPosts(callback) {

    fs.readFile(POST_FILES, "utf-8", (err, data) => {
        if (err) {
            console.log("error happend -------- " + err)
        }

        try {
            data = JSON.parse(data)
            callback(null, data)
            // console.log(data)
        } catch (error) {
            console.log("error is here " + error);
        }
    })
}




function getPost(id, callback) {

    getAllPosts((err, posts) => {
        if (err) {
            console.log("error", err)
            callback(err, null);
            return;
        }
        const post = posts.filter((item) => item.id == id);
        console.log(post)
        if (post.length == 0) {

            callback(null, {
                status: 404,
                message: "ressource not found"
            });
        }
        callback(null, post[0]);

    });
}




function insertPost(newPost, callback) {
    fs.readFile(POST_FILES, "utf-8", (err, data) => {
        if (err) return console.log(err);
        try {
            const posts = data.length != 0 ? JSON.parse(data) : new Array();
            newPostId = posts[posts.length - 1].id
            const postToSave = {
                id: ++newPostId,
                ...newPost
            }

            posts.push(postToSave);

            fs.writeFile(POST_FILES, JSON.stringify(posts, null, 4), (writerEror) => {
                if (writerEror) {
                    console.error(writerEror);
                    callback(writerEror, null);
                    return
                }

                callback(null, postToSave)
            });

        } catch (err) {
            console.error(err)
        }

    })
}


function updatePost(id, updatePost, callback) {
    fs.readFile(POST_FILES, "utf-8", (err, data) => {
        if (err) {
            console.error("error in reading");
            callback("error", null);
        }

        data = JSON.parse(data);

        if (data.length && data.filter((element) => element.id == id)) {
            const updatedOne = data.map((ele) => {
                if (ele.id == id) {
                    return { ...ele, userId: updatePost.userId, title: updatePost.title, body: updatePost.body };
                }
                return ele
            });
            // console.log(updatePost)
            fs.writeFile(POST_FILES, JSON.stringify(updatedOne, null, 4), (writerError) => {
                if (writerError) {
                    console.error(writerError);
                    callback("error", null);
                    return
                }

                callback(null, {
                    id:id,
                    ...updatePost
                })
            });
        }
    })
}

function deletePost(id, callback) {

    fs.readFile(POST_FILES, "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            callback("error here", null);
        }

        data = JSON.parse(data);
        if (data.length != 0 && data.filter((ele) => ele.id == id)) {

            restedElements = data.filter((ele) => ele.id !== id);
            deletedOne = data.filter((ele) => ele.id == id);
            fs.writeFile(POST_FILES, JSON.stringify(restedElements, null, 4), (writerError) => {
                if (writerError) {
                    console.error(writerError);
                    callback("errrr", null);
                }

                callback(null, deletedOne)

            })
        }


    })
}

function savePosts(newPosts, callback) {

    getAllPosts((err, posts) => {
        if (err) {
            console.error("error");
            callback(err, null);
        }

        // console.log(posts);

        newPosts.forEach(element => {
            posts.push(element);
        });

        fs.writeFile(POST_FILES, JSON.stringify(posts, null, 4), (writerError) => {
            if (writerError) {
                console.error(writerError);
                callback(writerError, null);
            }
            callback(null, newPosts)
        })
        // console.log(posts.at(-2), posts.at(-1))


    });

}



// ========main===========

// getPost(55, (err, post) => {
//     if (err) {
//         console.log("err again", err)
//         return;
//     }
//     console.log("Found Post", post)
// });

// insertPost({
//     userId: 6,
//     title: 'sit vel voluptatem et non libero',
//     body: 'debitis excepturi ea perferendis harum libero optio\n' + 'eos accusamus cum fuga ut sapiente repudiandae\n' + 'et ut incidunt omnis molestiae\n' + 'nihil ut eum odit'
// }, (err, result) => {
//     if (result) {
//         console.log("File save d !");
//     }
//     if (err) {
//         console.log("erro in saving !");

//     }
// });


// updatePost(101, {
//     id: 101,
//     userId: 9,
//     title: 'yassine malal updated',
//     body: 'debitis excepturi ea perferendis harum libero optio\n' + 'eos accusamus cum fuga ut sapiente repudiandae\n' + 'et ut incidunt omnis molestiae\n' + 'nihil ut eum odit'
// }, (err, data) => {
//     if (err) {
//         console.log("probleeem");
//     }
//     if (data) {
//         console.log(data);
//     }
// });


// deletePost(101,(err,data)=>{
//     if(err){
//         console.log(err);
//     }
//     if(data){
//         console.log(data);
//     }
// })

// savePosts(

//     [
//         {
//             id: 102,
//             userId: 12,
//             title: 'yassine malal group',
//             body: 'debitis excepturi ea perferendis harum libero optio\n' + 'eos accusamus cum fuga ut sapiente repudiandae\n' + 'et ut incidunt omnis molestiae\n' + 'nihil ut eum odit'
//         },
//         {
//             id: 103,
//             userId: 12,
//             title: 'yassine malal group',
//             body: 'debitis excepturi ea perferendis harum libero optio\n' + 'eos accusamus cum fuga ut sapiente repudiandae\n' + 'et ut incidunt omnis molestiae\n' + 'nihil ut eum odit'
//         },
//     ]

// ,(err,data)=>{
//     if(err){
//         console.err(err);
//         return
//     }

//     console.log(data);

// })


module.exports = {
    deletePost,
    insertPost,
    savePosts,
    getPost,
    getAllPosts,
    updatePost
}