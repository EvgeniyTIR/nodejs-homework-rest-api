const { authMiddlware } = require("../middlewares/authMiddleware");
const jwt = require("jsonwebtoken");

describe("authMiddlware test", () => {
	it("should call next() and add user and token properties to req object", () => {
		const a = 1;
		const b = 1;
		const addTwoNumbersResult = addTwoNumbers(a, b);
		expect(addTwoNumbersResult).toEqual(a + b);
	});
});
