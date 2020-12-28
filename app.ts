import fetch from './helper/fetchCycle';
import { PORT, VERIFY_TOKEN } from './helper/variable';
import cors from "cors";
import express from "express";


const app = express()
app.use(cors());
app.use(express.json());


// Verify Facebook App
app.get('/webhook', (req, res) => {

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook vertify !')
        res.status(200).send(challenge)
    } else {
        res.sendStatus(403)
    }
}) 

app.post('/webhook', (req, res) => {
    console.log(req.body)

    if (req.body.object === 'page' && req.body.entry!==undefined){
        req.body.entry.forEach( (entry:any) => {
            let webhook_event = entry.messaging[0];
            console.log(webhook_event);
            res.status(200).send('EVENT_RECEIVED');
        });
    } else {
        res.sendStatus(404)
    }
})


app.listen(PORT, () => console.log(`Server webhook listening on port ${PORT}`))
