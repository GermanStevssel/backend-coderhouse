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

container.save({
	title: "Uncharted 4",
	price: 5665,
	thumbnail:
		"http://d3ugyf2ht6aenh.cloudfront.net/stores/001/159/532/products/uncharted-41-7c6539daee1256fa0715881138324461-640-0.jpg",
});
container.save({
	title: "Hollow Kinght",
	price: 8065,
	thumbnail:
		"https://savegame.pro/wp-content/uploads/2020/02/hollow-knight-cover.jpg",
});

console.log(container.getAll());
container.getById(1);
container.deleteById(2);
// container.deleteAll();
