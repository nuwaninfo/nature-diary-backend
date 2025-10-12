import express from "express"
import type { Express } from "express"
import morgan from "morgan"
import router from "./src/index.js"
import dotenv from "dotenv"

dotenv.config()

const app: Express = express()
const port: number = parseInt(process.env.PORT as string) || 8001

// Middleware in Express that allows your server to parse incoming requests with JSON payloads.
app.use(express.json())

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({extended: false}))
app.use(morgan("dev"))
app.use("/", router)

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})