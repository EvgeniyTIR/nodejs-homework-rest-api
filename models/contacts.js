const fs = require("fs").promises;
const path = require("path");
const contactsDB = path.resolve("./models/contacts.json");

const listContacts = async () => {
	const data = await fs.readFile(contactsDB);
	console.log(JSON.parse(data));
	return JSON.parse(data);
};

const getContactById = async (contactId) => {
	const data = await fs.readFile(contactsDB);
	const parsed = JSON.parse(data);
	const [getById] = parsed.filter((it) => it.id === contactId);
	return getById;
};

const removeContact = async (contactId) => {};

const addContact = async (body) => {};

const updateContact = async (contactId, body) => {};

module.exports = {
	listContacts,
	getContactById,
	removeContact,
	addContact,
	updateContact,
};
