const fs = require("fs");
import Contenedor from "./templates/ejs/container.js";
const container = new Contenedor("./products.txt");
import express, { json, urlencoded } from "express";
const app = express();
const { Router } = express;
const router = Router();
const PORT = 8080;

app.use("/api", router); // las rutas de router inician con /api/....
const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

router.use(json());
router.use(urlencoded({ extended: true }));

app.set("view engine", "ejs"); // registra el motor de plantillas
app.set("views", "./views"); // especifica el directorio de vistas

const videogames = [];

// Endpoints
app.get("/", (req, res) => {
	res.render("index");
});
app.get("/bitacora", (req, res) => {
	res.render("bitacora", { videogames });
});

router.get("/productos", (req, res) => {
	res.send(container.getAll());
});

router.get("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	const product = container.getById(productId);
	res.send(`<div>
	<h1>${product.title}</h1>
	<h2>$ ${product.price}</h2>
	<img src="${product.thumbnail}" alt="Imagen de videjouego" />
	</div>`);
});

router.post("/productos", (req, res) => {
	container.save(req.body);
	videogames.push(req.body);
	res.redirect("/");
});

router.put("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	container.updateById(productId, {
		...req.body,
		id: productId,
	});
	res.send(container.getById(productId));
});

router.delete("/productos/:productId", (req, res) => {
	const productId = parseInt(req.params.productId);
	res.send(container.deleteById(productId));
});
