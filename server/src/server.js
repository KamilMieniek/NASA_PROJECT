const http = require('http');

const app = require('./app')

const server = http.createServer(app);
const {loadPlanetData} = require('./models/planets.model');
const PORT = process.env.PORT || 8000

async function startServer(){
    await loadPlanetData();

    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}...`)
    })
    
}

startServer()
