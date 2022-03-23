export class Container {
	constructor(config, table) {
		this.config = config;
		this.table = table;
		this.query = [];
	}

	getAll() {
		const fileContent = this.config;
		fileContent
			.from(this.table)
			.select("*")
			.then((rows) => {
				rows.forEach((row) => {
					console.log(`${row.id} ${row.name} ${row.price} ${row.stock}`);
					this.query.push(row);
				});
			})
			.catch((err) => {
				console.err(err);
				throw err;
			})
			.finally(() => {
				knex.destroy();
			});

		return this.query;
	}
	getById(id) {
		const fileContent = this.config;
		fileContent
			.from(this.table)
			.where("id", "=", id)
			.select("*")
			.then((data) => {
				console.log(data);
				console.log(data[0]);
				this.query.push(data[0]);
			})
			.catch((err) => {
				console.log(err);
				throw err;
			});

		return this.query;
	}

	deleteById(id) {
		const fileContent = this.config;
		fileContent
			.from(this.table)
			.where("id", "=", id)
			.del()
			.then(() => console.log(`Producto con id ${id} eliminado`))
			.catch((err) => {
				console.log(err);
				throw err;
			});

		return this.query;
	}

	deleteAll() {
		const fileContent = this.config;
		fileContent
			.from(this.table)
			.del()
			.then(() => console.log("Se han eliminado todos los productos"))
			.catch((err) => {
				console.log(err);
				throw err;
			})
			.finally(() => {
				this.config.destroy();
			});
	}

	updateById(id, newProduct) {
		this.config
			.from(this.table)
			.where("id", "=", id)
			.update(newProduct)
			.then(() => console.log(`El producto con id ${id} se ha actualizado`))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}

	save(product) {
		this.config(this.table)
			.insert(product)
			.then(() => console.log("Producto agregado"))
			.catch((err) => {
				console.log(err);
				throw err;
			});
	}
}
