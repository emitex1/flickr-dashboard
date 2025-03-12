import { ErrorObject } from "../types/other";

export const showErrorMessage = (error: unknown, prefixMsg?: string) => {
	console.error(
		prefixMsg ? "[" + prefixMsg + "]" : "[Error]: ",
		(error as ErrorObject).message
	);
};
