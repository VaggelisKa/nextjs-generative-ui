# Next.js Generative UI with Vercel AI SDK and AWS Bedrock

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app), showcasing the integration of the Vercel AI SDK with AWS Bedrock.

## Features

1. Generative UI Chat: A chat interface that allows users to interact with the chatbot using natural language.
2. Generative UI Chat: A chat interface that can respond to user queries with interactive charts and actual UI components.

## Running locally

First, ensure you have your environment configured with all necessary keys. Create a `.env.local` file with your credentials:

```plaintext
AWS_ACCESS_KEY_ID=<your-aws-access-key-id>
AWS_SECRET_ACCESS_KEY=<your-aws-secret-access-key>
VERCEL_API_KEY=<your-vercel-api-key>
```

Then install the dependencies:

```bash
pnpm install
# or
npm install
```

After that, run the development server:

```bash
pnpm dev
# or
npm run dev
```
