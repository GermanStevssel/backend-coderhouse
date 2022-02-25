import express, { json, urlencoded } from "express";
const app = express();
import { videogamesRouter } from "./routes/videogamesRouter.js";
import { cartRouter } from "./routes/cartsRouter.js";
const PORT = 8080 || process.env.PORT;

app.use("/center/videogames", videogamesRouter);
app.use("/center/cart", cartRouter);
app.use(express.static("public"));

videogamesRouter.use(json());
videogamesRouter.use(urlencoded({ extended: true }));
cartRouter.use(json());
cartRouter.use(urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
