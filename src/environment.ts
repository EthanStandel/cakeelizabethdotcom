const environment = {
  serviceAddress: process.env.SERVICE_ADDRESS!,
  mail: {
    turnOffMail: process.env.MAIL_TURN_OFF_REAL_MAILER! === "true",
    target: process.env.MAIL_TARGET!,
    apiKey: process.env.MAIL_API_KEY!,
    from: process.env.MAIL_FROM!,
  },
};

export default environment;
