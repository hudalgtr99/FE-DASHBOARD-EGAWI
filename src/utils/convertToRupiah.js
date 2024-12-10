export const convertToRupiah = (value) => {
	return value.toLocaleString("id-ID", {
		style: "currency",
		currency: "IDR",
		maximumFractionDigits: 0,
	});
};
