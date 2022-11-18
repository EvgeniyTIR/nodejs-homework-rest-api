const app = require("./app");
const { connectMongo } = require("./db/conection");
const { PORT } = require("./helpers/envImport");

const start = async () => {
	await connectMongo();
};

app.listen(PORT || 3000, () => {
	start();
	console.log(`Server running. Use our API on port: ${PORT}`);
});
