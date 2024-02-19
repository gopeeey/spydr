import axios, { AxiosError } from "axios";

interface FetchDataProps {
  inputUrl: string;
  maxAttempts?: number;
  timeout?: number;
  retryDelay?: number;
}

export const fetchData = async ({
  inputUrl,
  maxAttempts = 1,
  timeout,
  retryDelay = 1000,
}: FetchDataProps) => {
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      attempts++;
      const { data } = await axios.get(inputUrl, {
        timeout,
        timeoutErrorMessage: "The request timed out",
      });
      return data as string;
    } catch (err) {
      // console.log(err);
      if (err instanceof AxiosError) {
        if (err.response && err.response.status === 404) return null;
      }

      if (attempts >= maxAttempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }

  return null;
};
