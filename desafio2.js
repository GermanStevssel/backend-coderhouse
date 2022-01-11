const fs = require("fs");

class Contenedor {
	constructor(file) {
		this.file = file;
		this.object = [];
	}

	getAll() {
		const fileContent = JSON.parse(fs.readFileSync(this.file, "utf8"));
		this.object = fileContent;
		return this.object;
	}
	getById(id) {
		const products = this.getAll();
		const filteredArray = products.filter((product) => product.id === id);
		if (filteredArray[0]) {
			return filteredArray[0];
		} else {
			return null;
		}
	}
	deleteById(id) {
		const products = this.getAll();
		const filteredArray = products.filter((product) => product.id !== id);
		fs.writeFileSync("./products.txt", JSON.stringify(filteredArray));
	}
	deleteAll() {
		fs.writeFileSync("./products.txt", JSON.stringify([]));
	}
	save(obj) {
		const products = this.getAll();
		console.log(products);
		if (products.length === 0) {
			const newObj = { ...obj, id: 1 };
			products.push(newObj);
			fs.writeFileSync("./products.txt", JSON.stringify(products));
		} else {
			const indexOfLastElement = products.length - 1;
			const newObj = { ...obj, id: products[indexOfLastElement].id + 1 };
			products.push(newObj);
			fs.writeFileSync("./products.txt", JSON.stringify(products));
		}
	}
}

const container = new Contenedor("./products.txt");

console.log(container.getAll());

container.save({
	title: "Uncharted 4",
	price: 5665,
	thumbnail:
		"http://d3ugyf2ht6aenh.cloudfront.net/stores/001/159/532/products/uncharted-41-7c6539daee1256fa0715881138324461-640-0.jpg",
});
container.save({
	title: "Hollow Knight",
	price: 8075,
	thumbnail:
		"https://savegame.pro/wp-content/uploads/2020/02/hollow-knight-cover.jpg",
});

container.getById(9);
container.getById(2);
container.deleteById(1);
container.getAll();
