const express = require("express");
const app = express();
const { Router } = express;
const router = Router();
const PORT = 8080;
const fs = require("fs");

class Contenedor {
	constructor(fileName) {
		this.fileName = fileName;
		this.products = [];
	}
	getAll() {
		const fileContent = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
		this.products = fileContent;
		return this.products;
	}
	getById(id) {
		const products = this.getAll();
		const productFinded = products.find((product) => product.id === id);

		if (productFinded) {
			console.log(productFinded);
			return productFinded;
		} else {
			console.log("El producto no existe");
			return null;
		}
	}

	deleteById(id) {
		const products = this.getAll();
		const idExist = products.some((product) => product.id === id);

		if (!idExist) {
			console.log(`El producto con id ${id} no existe`);
			return;
		}

		const newProducts = products.filter((product) => product.id !== id);
		const textNewProducts = JSON.stringify(newProducts);
		fs.writeFileSync(this.fileName, textNewProducts);
	}

	deleteAll() {
		const emptyFile = JSON.stringify([]);
		try {
			fs.writeFileSync(this.fileName, emptyFile);
			console.log("Todos los productos han sido borrados");
		} catch (err) {
			console.error(err);
		}
	}
	save(product) {
		let id;
		const products = this.getAll();
		if (products.length === 0) {
			id = 1;
			const productWithId = { ...product, id: id };
			products.push(productWithId);
			const txtProduct = JSON.stringify(products);
			fs.writeFileSync(this.fileName, txtProduct);
		} else {
			id = products[products.length - 1].id + 1;
			const productWithId = { ...product, id: id };
			products.push(productWithId);
			const txtProduct = JSON.stringify(products);
			fs.writeFileSync(this.fileName, txtProduct);
		}
	}
}

const container = new Contenedor("./products.txt");

// container.save({
// 	title: "Uncharted 4",
// 	price: 5665,
// 	thumbnail:
// 		"http://d3ugyf2ht6aenh.cloudfront.net/stores/001/159/532/products/uncharted-41-7c6539daee1256fa0715881138324461-640-0.jpg",
// });
// container.save({
// 	title: "Hollow Kinght",
// 	price: 8065,
// 	thumbnail:
// 		"https://savegame.pro/wp-content/uploads/2020/02/hollow-knight-cover.jpg",
// });
// container.save({
// 	title: "Far Cry 6",
// 	price: 12560,
// 	thumbnail:
// 		"https://cdn1.epicgames.com/b4565296c22549e4830c13bc7506642d/offer/TETRA_PREORDER_STANDARD%20EDITION_EPIC_Store_Landscape_2560x1440-2560x1440-827a9d1823ad230a0ea5a2efc7936370.jpg?h=270&resize=1&w=480",
// });

// console.log(container.getAll());
// container.getById(1);
// container.deleteById(2);
// container.deleteAll();

// Desafío 3

// se indica el puerto en el cual nuestra aplicación reciba las peticiones
// Colocando 0, express selecciona un puerto libre al azar
const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

/* El método .on() sirve para indicar un error en la puesta en marcha del servidor, sobre
 * la salida de .listen()
 */
server.on("error", (error) => console.log(`Error en servidor ${error}`));

// app.all("/", function (request, response) {
// 	response.send(
// 		"<h1>Desafío 3</h1><h2><a href='./productos'>Productos</h2><h2><a href='./producto-random'>Producto random</h2>"
// 	);
// });

// Para obtener info del server, utilizamos la petición GET
// Obtener todos los productos en un array
// app.get("/productos", (req, res) => {
// 	res.send(container.getAll());
// });

// Obtener un producto random
// app.get("/producto-random", (req, res) => {
// 	const maxProducts = container.getAll().length + 1;
// 	const productId = Math.floor(Math.random() * (maxProducts - 1)) + 1;
// 	const product = container.getById(productId);
// 	res.send(`<div>
// 		<h1>${product.title}</h1>
// 		<h2>$ ${product.price}</h2>
// 		<img src="${product.thumbnail}" alt="Imagen de videjouego" />
// 	</div>`);
// });

// Desafío 4

app.use("/api", router);

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

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
	const idProvided = Number(req.params.id);
	container.updateById(idProvided, {
		...req.body,
		id: idProvided,
	});
	res.send(container.getById(idProvided));
});

router.delete("/productos/:id", (req, res) => {
	const idProvided = Number(req.params.id);
	res.send(container.deleteById(idProvided));
});
