const Jimp = require("jimp");
const fs = require("fs/promises");
const path = require("path");
const { User } = require("../models/usersSchema");

const updateAvatarsControler = async (req, res, next) => {
	const { filename } = req.file;
	const { _id } = req.user;
	Jimp.read(path.resolve(`./tmp/${filename}`), (err, avatar) => {
		if (err) throw err;
		avatar
			.resize(250, 250)
			.quality(60)
			.greyscale()
			.write(path.resolve(`./public/avatars/${filename}`));
	});

	const avatarURL = `avatars/${filename}`;

	const updatedUserAvatar = await User.findByIdAndUpdate(
		_id,
		{ avatarURL },
		{ new: true }
	).select({ avatarURL: 1, _id: 0 });
	return res.status(200).json(updatedUserAvatar);
};

module.exports = {
	updateAvatarsControler,
};
