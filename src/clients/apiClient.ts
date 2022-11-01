import { ContactForm } from "../models/ContactForm";

const apiClient = {
  submitContactForm: async (form: ContactForm): Promise<boolean> => {
    try {
      const response = await fetch("/api/contact", {
        body: JSON.stringify(form),
      });
      if (response.status === 200) {
        return true;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  },
};

export default apiClient;
