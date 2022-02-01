const Contenedor = require("./container.js");
const container = new Contenedor("./products.txt");
const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const PORT = 8080;

app.use("/api", router); // las rutas de router inician con /api/....
const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.set("view engine", "pug"); // registra el motor de plantillas
app.set("views", "./views"); // especifica el directorio de vistas

// Endpoints
app.get("/", (req, res) => {
	const data = {
		title: "Título",
		price: "Precio",
		thumbnail: "Imagen",
	};
	res.render("data_form", data);
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
