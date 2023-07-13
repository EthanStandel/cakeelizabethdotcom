# cakeelizabeth.com

## Tooling overview

- **Framework**: [Next.js](https://nextjs.org/)
- **Deployment**: [Vercel](https://vercel.com)
- **Content**: [Tina](https://tina.io/)
- **Styling**: [Tailwind](https://tailwindcss.com/)
- **Animations**: [use-presence](https://www.npmjs.com/package/use-presence)
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
- `src/*` - all logic, templating, and styles
  - `src/app/*` - all route content
