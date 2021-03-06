import Container from "./containers/containerFS.js";

const container = new Container("./products.txt");

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

container.save({
	title: "Far Cry 6",
	price: 12560,
	thumbnail:
		"https://cdn1.epicgames.com/b4565296c22549e4830c13bc7506642d/offer/TETRA_PREORDER_STANDARD%20EDITION_EPIC_Store_Landscape_2560x1440-2560x1440-827a9d1823ad230a0ea5a2efc7936370.jpg?h=270&resize=1&w=480",
});

console.log(container.getAll());
container.getById(1);
container.deleteById(2);
container.deleteAll();
