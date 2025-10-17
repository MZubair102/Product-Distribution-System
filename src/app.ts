import "reflect-metadata";
import * as express from "express";
// import { AppDataSource } from "./data-source";
import { datasource } from "./config/data-source";
import errorHandler from "./middleware/errorHandler";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";


const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/", userRouter);

app.use(errorHandler);

// sendMail("ali123@mail.com","Welcome","Mail Send is succesfull");
datasource.initialize()
.then(() => {
    console.log("Datasource has been initialized!"),
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);

        });
}).catch((err) => {
    console.log("Database connection failed : ", err)
    console.dir(err, { depth: 10 });
});

app.get("/",(req,res)=>{
    res.send("Hello World")
})

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })