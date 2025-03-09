export const commaSeparateNumber = (value: number | undefined): string => {
	if (value === undefined) return "0";
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
