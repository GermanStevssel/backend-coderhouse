const Contenedor = require("./container.js");
const container = new Contenedor("./products.txt");
const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const PORT = 8080;

app.use("/api", router); // las rutas de router inician con /api/....
app.listen(PORT);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get("/productos", (req, res) => {
	res.send(container.getAll());
});

router.get("/producto/:productId", (req, res) => {
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
	res.json(req.body);
});

router.put("/productos/:id", (req, res) => {
	const productId = parseInt(req.params.productId);
	container.updateById(productId, {
		...req.body,
		id: productId,
	});
	res.send(container.getById(idProvided));
});

router.delete("/productos/:id", (req, res) => {
	const productId = parseInt(req.params.productId);
	res.send(container.deleteById(productId));
});

app.use(express.static("public"));
