const { Contacts } = require("../models/contactSchema");

const listContactsController = async (req, res) => {
	const { _id } = req.user;
	const { page = 1, limit = 5 } = req.query;
	const skip = (page - 1) * limit;
	const contact = await Contacts.find({ owner: _id })
		.select({ __v: 0 })
		.skip(parseInt(skip))
		.limit(parseInt(limit));
	res.json({ contact, page, limit });
};
const getContactByIdController = async (req, res) => {
	const { contactId } = req.params;
	const { _id } = req.user;
	const contact = await Contacts.findById({ _id: contactId, owner: _id });

	if (!contact) {
		res.status(404).json({ message: "Not found" });
		return;
	}
	res.json(contact);
};
const removeContactController = async (req, res) => {
	const { _id } = req.user;
	const { contactId } = req.params;
	const deletedContact = await Contacts.findOneAndDelete({
		_id: contactId,
		owner: _id,
	});
	deletedContact
		? res.json({ message: "contact deleted" })
		: res.status(404).json({ message: "Not found" });
};

const addContactController = async (req, res) => {
	const { _id } = req.user;
	const contact = new Contacts({ owner: _id, ...req.body });
	const newContact = await contact.save();
	res.status(201).json(newContact);
};
const updateContactController = async (req, res) => {
	const { _id } = req.user;
	const { contactId } = req.params;
	await Contacts.findOneAndUpdate(
		{ _id: contactId, owner: _id },
		{ $set: req.body },
		{ new: true }
	);
	const changedContact = await Contacts.findById(contactId);
	if (changedContact) {
		return res.json(changedContact);
	} else {
		return res.status(404).json({ message: "Not found" });
	}
};
const updateStatusContactController = async (req, res) => {
	const { contactId } = req.params;
	const { favorite } = req.body;
	const { _id } = req.user;

	await Contacts.findByIdAndUpdate(
		{ _id: contactId, owner: _id },
		{ favorite },
		{ new: true }
	);
	const updatedContact = await Contacts.findById(contactId);
	if (updatedContact) {
		return res.json(updatedContact);
	} else {
		return res.status(404).json({ message: "Not found" });
	}
};

module.exports = {
	listContactsController,
	getContactByIdController,
	removeContactController,
	addContactController,
	updateContactController,
	updateStatusContactController,
};
