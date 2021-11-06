const environment = {
  serviceAddress: process.env.SERVICE_ADDRESS!,
  mail: {
    target: process.env.MAIL_TARGET!,
    apiKey: process.env.MAIL_API_KEY!,
    from: process.env.MAIL_FROM!,
  },
};

export default environment;
