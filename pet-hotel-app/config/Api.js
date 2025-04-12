import axios from "axios";

const VIETQR_URL = "https://api.vietqr.io/v2/banks";

export async function getBanksList() {
    try {
      const res = await axios({
        method: "GET",
        url: VIETQR_URL,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    } catch (error) {
      return error.response ? error.response.data : error.message;
    }
  }
  