# mern-project

The frontend and backend are deployed as separate Vercel projects. Set each
project's Root Directory to its respective folder under `apps/`.

## Vercel environment variables

Backend:

- `URL`: MongoDB connection string
- `SECRET`: JWT signing secret
- `SALT`: bcrypt salt rounds
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `CLIENT_URL`: deployed frontend URL

Frontend:

- `VITE_API_URL`: deployed backend URL followed by `/api`

Vercel Functions handle the backend HTTP API. The Socket.IO server still needs
a persistent Node host; realtime messaging will not work when that server is
deployed as a Vercel Function.

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.js
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
