import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression"
import cors from "cors";
import openAIRoutes from "./routes/openAIRoutes";

const app  = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json()); // Middleware to parse JSON

app.use('/api', openAIRoutes); // Adjust the base URL as necessary

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
