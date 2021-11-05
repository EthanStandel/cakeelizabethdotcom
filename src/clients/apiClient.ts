import axios from "axios";

import { ContactForm } from "../models/ContactForm";

const client = axios.create({ baseURL: "/api" });

const apiClient = {
  submitContactForm: async (form: ContactForm): Promise<boolean> => {
    try {
      const response = await client.post<{ status: string }>("/contact", form);
      if (response.data.status === "ok") {
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  },
};

export default apiClient;
