const statusCode = {
  is2xx: (code: string | number) => {
    const codeNum = typeof code === "string" ? Number(code) : code;
    return codeNum >= 200 && codeNum <= 299;
  },
};

export default statusCode;
