const Contenedor = require("./container.js");
const container = new Contenedor("./products.txt");
const express = require("express");
const app = express();
const PORT = 8080;

// se indica el puerto en el cual nuestra aplicación reciba las peticiones
// Colocando 0, express selecciona un puerto libre al azar
const server = app.listen(PORT, () => {
	console.log(`Express is listening in port http://localhost:${PORT}`);
});

/* El método .on() sirve para indicar un error en la puesta en marcha del servidor, sobre
 * la salida de .listen()
 */
server.on("error", (error) => console.log(`Error en servidor ${error}`));

app.all("/", function (request, response) {
	response.send(
		"<h1>Desafío 3</h1><h2><a href='./productos'>Productos</h2><h2><a href='./producto-random'>Producto random</h2>"
	);
});
// Para obtener info del server, utilizamos la petición GET
app.get("/productos", (req, res) => {
	res.send(container.getAll()); // Obtener todos los productos en un array
});
// Obtener un producto random
app.get("/producto-random", (req, res) => {
	const maxProducts = container.getAll().length + 1;
	const productId = Math.floor(Math.random() * (maxProducts - 1)) + 1;
	const product = container.getById(productId);
	res.send(`<div>
		<h1>${product.title}</h1>
		<h2>$ ${product.price}</h2>
		<img src="${product.thumbnail}" alt="Imagen de videjouego" />
	</div>`);
});
