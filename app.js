import express from 'express'
import routes from './routes/routes.js'
import bodyParser from 'body-parser';



const app = express()
app.use(bodyParser.json());
const port = process.env.port || 3000


app.get('app/status',(req, res)=>{
    return res.send("App server running good")
});


app.use(express.static('public'))
app.use('app/api', routes)





app.listen(port,()=>{
    console.log("App listen to the port:"+ port)
})