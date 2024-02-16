import axios, { AxiosError, AxiosRequestHeaders } from "axios";
import { fetchData } from "~/lib";

const axiosGetSpy = jest.spyOn(axios, "get");

const axiosError = new AxiosError("Testing", "400", {
  headers: {} as unknown as AxiosRequestHeaders,
  data: {},
  responseType: "json",
});

describe("\n **http-client", () => {
  describe("-> fetchData", () => {
    const axiosRes = { data: "Hello world!" };
    const testUrl = "https://jsonplaceholder.typicode.com/posts/1";

    it("should make an axios GET request with the correct parameters", async () => {
      axiosGetSpy.mockResolvedValue(axiosRes);
      await fetchData({
        inputUrl: testUrl,
        maxAttempts: 3,
        timeout: 10000,
        retryDelay: 2000,
      });

      expect(axiosGetSpy).toHaveBeenCalledTimes(1);
      expect(axiosGetSpy).toHaveBeenCalledWith(testUrl, {
        timeout: 10000,
        timeoutErrorMessage: "The request timed out",
      });
    });

    describe("given the request succeeds", () => {
      it("should return the expected data", async () => {
        const data = await fetchData({
          inputUrl: testUrl,
        });

        expect(data).toEqual(axiosRes.data);
      });
    });

    describe("given the request fails", () => {
      it("should retry the request the specified number of times", async () => {
        axiosGetSpy.mockRejectedValue(axiosError);
        const maxAttempts = 2;
        const fn = () =>
          fetchData({
            inputUrl: testUrl,
            maxAttempts,
            timeout: 10000,
            retryDelay: 200,
          });
        await expect(fn).rejects.toThrow(axiosError);

        expect(axiosGetSpy).toHaveBeenCalledTimes(maxAttempts);
      });
    });
  });
});
