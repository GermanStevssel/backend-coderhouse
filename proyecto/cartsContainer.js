import fs from "fs";

const cartError = { error: -2, description: "Carrito no encontrado" };

export default class CartsContainer {
	constructor(fileName) {
		this.fileName = fileName;
		this.carts = [];
	}

	getAll() {
		const cartsContent = JSON.parse(fs.readFileSync(this.fileName, "utf8"));
		this.carts = cartsContent;
		return this.carts;
	}

	getVideogamesByCartId(id, req, res) {
		const carts = this.getAll();

		console.log("id:", id);
		const userCart = carts.filter((cart) => cart.id === id);
		console.log("userCart:", userCart);
		if (userCart?.length > 0) {
			console.log(userCart[0].videogames.length > 0);
			userCart[0].videogames.length > 0
				? res.send(userCart[0].videogames)
				: res.send({ products: "No hay productos en este carrito" });
		} else {
			res.send(cartError);
		}
	}

	addVideogameToCart(id, req, res) {
		const carts = this.getAll();

		if (!carts.some((cart) => cart.id === id)) {
			res.send(cartError);
		}
		let videogame = req.body;

		const indexOfCart = carts.findIndex((cart) => cart.id === id);

		if (carts[indexOfCart].videogames.length > 0) {
			const idNewVideogame =
				carts[indexOfCart].videogames[carts[indexOfCart].videogames.length - 1]
					.id + 1;
			videogame = { ...videogame, id: idNewVideogame };
			const videogamesCollection = carts[indexOfCart].videogames;
			carts[indexOfCart].videogames = [...videogamesCollection, videogame];
			res.send({ response: "Videojuego agregado al carrito" });
		} else {
			videogame = { ...videogame, id: 1 };
			const videogamesCollection = carts[indexOfCart].videogames;
			carts[indexOfCart].videogames = [...videogamesCollection, videogame];
			res.send({ response: "Videojuego agregado al carrito" });
		}

		const textCarts = JSON.stringify(carts);
		fs.writeFileSync("./carts.txt", textCarts);
	}

	deleteById(id, req, res) {
		const carts = this.getAll();
		const idExist = carts.some((cart) => cart.id === id);

		if (!idExist) {
			res.send(`El carrito con id ${id} no existe`);
		}

		const indexOfCart = carts.findIndex((cart) => cart.id === id);

		if (indexOfCart > -1) {
			carts.splice(indexOfCart, 1);
			res.send({ result: `Carrito eliminado: ${id}` });
		} else {
			res.send(cartError);
		}

		const textCarts = JSON.stringify(carts);
		fs.writeFileSync("./carts.txt", textCarts);
	}

	deleteVideogameInCartWithId(cartId, videogameId, req, res) {
		const carts = this.getAll();

		const indexOfCart = carts.findIndex((cart) => cart.id === cartId);

		if (indexOfCart > -1) {
			const videogamesInCart = carts[indexOfCart].videogames;
			const videogameIndex = videogamesInCart.findIndex(
				(videogame) => videogame.id === videogameId
			);
			if (videogameIndex > -1) {
				videogamesInCart.splice(videogameIndex, 1);
				res.send({
					result: `Videojuego id ${videogameId} eliminado del carrito de id ${cartId}`,
				});
			} else {
				res.send(cartError);
			}
		} else {
			res.send(cartError);
		}
		const textCarts = JSON.stringify(carts);
		fs.writeFileSync("./carts.txt", textCarts);
	}

	createCart(req, res) {
		const carts = this.getAll();

		console.log(carts);

		if (carts.length === 0) {
			const newCart = {
				id: 1,
				cartTimeStamp: new Date().toLocaleString(),
				videogames: [],
			};
			carts.push(newCart);
			res.send(
				`Nuevo carrito creado, su número de id es: ${newCart.id.toString()}`
			);
		} else {
			const indexOfLastElement = carts.length - 1;
			const newCart = {
				id: carts[indexOfLastElement].id + 1,
				cartTimeStamp: new Date().toLocaleString(),
				videogames: [],
			};
			carts.push(newCart);
			res.send(
				`Nuevo carrito creado, su número de id es: ${newCart.id.toString()}`
			);
		}

		const textCarts = JSON.stringify(carts);
		fs.writeFileSync("./carts.txt", textCarts);
	}
}
