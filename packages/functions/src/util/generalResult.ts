export type GeneralResult = {
  isDone: boolean;
  status: number;
  message: string;
  data: unknown;
}

export const failResult = (status?: number, message?: string): GeneralResult => {
  return {
    isDone: false,
    status: status ?? 500,
    message: message ?? "An error occurred",
    data: null,
  };
};

export const successResult = (data: unknown, message?: string): GeneralResult => {
  return {
    isDone: true,
    status: 200,
    message: message ?? "Success",
    data: data,
  };
};