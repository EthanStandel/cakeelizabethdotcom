const TOKEN_PATTERN = /\{(\w+)\}/g;

// A placeholder whose name is not among the tokens is left as it is written.
export const fillTokens = <TToken extends string>(
  text: string,
  tokens: Record<TToken, string>,
) =>
  text.replace(TOKEN_PATTERN, (placeholder, token: string) =>
    Object.hasOwn(tokens, token) ? tokens[token as TToken] : placeholder,
  );

export const toToken = (name: string) => `{${name}}`;
