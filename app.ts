import cors from "cors";
import express from "express";
import { PORT } from './helper/variable';
import webhookRoute from './route/webhook'

const app = express()
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).send('Server working !')
})

app.use('/webhook', webhookRoute)

app.listen(PORT, () => console.log(`Server webhook listening on port ${PORT}`))
