# cakeelizabeth.com

## Tooling overview

- **Framework**: [Next.js](https://nextjs.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Content**: [contentlayer](https://github.com/contentlayerdev/contentlayer)
- **Styling**: [SASS modules](https://sass-lang.com/)
- **Components**: [Chakra](https://chakra-ui.com/)
- **Animations**: [AnimXYZ](https://animxyz.com/docs/)
- **Mailer**: [Sendgrid](https://sendgrid.com/)
- **Logging**: [LogFlare](https://logflare.app/)

## Running locally

### Basic

```bash
git clone git@github.com:EthanStandel/cakeelizabethdotcom.git
cd cakeelizabethdotcom
npm i
npm run dev
```

### Making the contact form work

Create a `.env.local` file in the root directory and fulfill these SendGrid properties

```env
MAIL_API_KEY=
MAIL_TARGET=
MAIL_FROM=
```

## Codebase overview

- `public/*` - all content that gets served publically
  - `public/resources/**/*.(md)|(json)` - content and data that is managed and distributed by [contentlayer](https://github.com/contentlayerdev/contentlayer)
- `scripts/*` - pre/post-build scripts
- `src/*` - all logic, templating, and styles
  - `src/pages/*` - all route content
  - `src/resources/*` - all one-off directly import resources
  - `src/styles/*` - all Sass modules