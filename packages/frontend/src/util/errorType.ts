type ErrorObject = {
	message: string;
};

export const showErrorMessage = (error: unknown, prefixMsg?: string) => {
	console.error(
		prefixMsg ? "[" + prefixMsg + "]" : "[Error]: ",
		(error as ErrorObject).message
	);
};
