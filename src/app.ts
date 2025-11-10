import "reflect-metadata";
import express from "express";
import  cors from "cors";
import path from "path";
import { datasource } from "./config/data-source";
import errorHandler from "./middleware/errorHandler";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
import cookieParser from "cookie-parser"

const app = express();
app.use(cookieParser())
app.use(express.json());

//  Enable CORS properly
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
// Server uploaded images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const port = process.env.PORT || 3000;
app.use("/api/auth", authRouter);
app.use("/", userRouter);

//  Error handling middleware
app.use(errorHandler);

//  Simple test route
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World");
// });

//  Initialize database and start server
datasource
  .initialize()
  .then(() => {
    console.log("Datasource has been initialized!");
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });



// import "reflect-metadata";
// import * as express from "express";
// // import { AppDataSource } from "./data-source";
// import { datasource } from "./config/data-source";
// import errorHandler from "./middleware/errorHandler";
// import { userRouter } from "./routes/user.routes";
// import { authRouter } from "./routes/auth.routes";
// // import cors from "cors";


// const app = express();
// // app.use(cors({
// //   origin: "http://localhost:5173",
// //   methods: ["GET", "POST", "PUT", "DELETE"],
// //   credentials: true,
// // }));
// const port = process.env.PORT || 3000;

// app.use(express.json());
// app.use("/api/auth", authRouter);
// app.use("/", userRouter);

// app.use(errorHandler);

// // sendMail("ali123@mail.com","Welcome","Mail Send is succesfull");
// datasource.initialize()
// .then(() => {
//     console.log("Datasource has been initialized!"),
//         app.listen(port, () => {
//             console.log(`Server is running at http://localhost:${port}`);

//         });
// }).catch((err) => {
//     console.log("Database connection failed : ", err)
//     console.dir(err, { depth: 10 });
// });

// app.get("/",(req,res)=>{
//     res.send("Hello World")
// })

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`)
// })