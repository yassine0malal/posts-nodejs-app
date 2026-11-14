const http = require('http');
const url = require('url');
const postManager = require('./postManager');

const PORT = 3000;

// Fonction pour parser le body JSON
function parseJsonBody(request, callback) {
    let body = '';
    request.on('data', chunk => {
        body += chunk.toString();
    });
    request.on('end', () => {
        try {
            const data = JSON.parse(body);
            callback(null, data);
        } catch (error) {
            callback(error, null);
        }
    });
}

// Créer le serveur en testant sur la méthode HTTP methid et le pathname
const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;
    const method = request.method;

    // Headers CORS pour permettre l'accès depuis le client web
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    response.setHeader('Content-Type', 'application/json');

    // Routes API

    // console.log("ddddddddd",parsedUrl)
    // GET /api/posts - Obtenir tous les posts
    if (pathname === '/api/posts' && method === 'GET') {
        postManager.getAllPosts((err, posts) => {
            if (err) {
                response.writeHead(500);
                response.end(JSON.stringify({ error: 'Erreur serveur' }));
            } else {
                response.writeHead(200);
                response.end(JSON.stringify(posts));
            }
        });
    }

    // GET /api/posts/:id - Obtenir un post par ID

    else if (pathname.startsWith('/api/posts/') && method === 'GET') {

        postManager.getPost(pathname.split('/')[3], (err, data) => {
            if (err) {
                response.writeHead(500);
                response.end(JSON.stringify({ error: "server error" }))
            } else {

                response.writeHead(200);
                response.end(JSON.stringify({ data }));

            }
        })
    }

    // POST /api/posts - Créer un nouveau post
    else if (pathname.startsWith('/api/posts') && method == "POST") {
        console.log("ddddddddd")
        // console.log(pathname.split('/')[3])
        parseJsonBody(request, (err, data) => {
            if (err) {
                console.error("error", err);
                response.writeHead(500);
                response.end(JSON.stringify({ error: "server error" }));
            }

            console.log(data)
            postManager.insertPost(data, (err, GettedData) => {
                if (err) {
                    console.log("Insertion failed");
                    response.writeHead(500);
                    response.end(JSON.stringify({ error: "server error" }));
                }
                console.log("success", GettedData)
                response.writeHead(200);
                response.end(JSON.stringify({ GettedData }))
            })
        })
    }



    // PUT /api/posts/:id - Mettre à jour un post

    else if (pathname.startsWith('/api/posts/') && method == "PUT") {
        if (!pathname.split('/')[3]) {
            console.error("id not sended ! ")
        }
        parseJsonBody(request, (err, data) => {
            if (err) {
                console.error("error", err);
                response.writeHead(500);
                response.end(JSON.stringify({ error: "server error" }));
            }

            // console.log(data)
            postManager.updatePost(Number(pathname.split('/')[3]), data, (err, GettedData) => {
                if (err) {
                    console.log("updated failed");
                    response.writeHead(500);
                    response.end(JSON.stringify({ error: "server error" }));
                }
                console.log("success", GettedData)
                response.writeHead(200);
                response.end(JSON.stringify(GettedData))
            })
        })
    }



    // DELETE /api/posts/:id - Supprimer un post

    else if (pathname.startsWith('/api/posts/') && method == "DELETE") {
        if (!pathname.split('/')[3]) {
            console.error("error the id was not sended ");
            response.writeHead(500)
            response.end(JSON.stringify({ error: "server error" }))
        }

        console.log("this is the element that should be deleted : ", pathname.split('/')[3]);
        postManager.deletePost(Number(pathname.split("/")[3]), (err, deletedOne) => {
            if (err) {
                console.error("error in post manager ");
                response.writeHead(500)
                response.end(JSON.stringify({ error: "server error" }))
            }
            response.writeHead(200);
            response.end(JSON.stringify({deletedOne:deletedOne[0]}))

        });

    }


    // Route non trouvée
    else {
        response.writeHead(404);
        response.end(JSON.stringify({ error: 'Route non trouvée' }));
    }
});

// Démarrer le serveur
server.listen(PORT, () => {
    console.log(`✅ Serveur API démarré sur http://localhost:${PORT}`);
    console.log('Routes disponibles:');
    console.log('  GET    /api/posts');
    console.log('  GET    /api/posts/:id');
    console.log('  POST   /api/posts');
    console.log('  PUT    /api/posts/:id');
    console.log('  DELETE /api/posts/:id');
});