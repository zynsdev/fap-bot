import { VERIFY_TOKEN } from './../helper/variable';
import { Router } from 'express';

const router = Router()

// Verify Facebook App
router.get('/', (req, res) => {
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

router.post('/', (req, res) => {
    req.body.entry.forEach((entry:any) => {
        let webhook_event = entry.messaging[0]
        console.log(webhook_event)
        let senderPSID = webhook_event.sender.id

    });
})

export default router