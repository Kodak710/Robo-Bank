# Robo Bank - Online Banking Application

A modern online banking application built with Node.js, Express, and MongoDB.

## Features

- User authentication
- Secure login system
- Dashboard with account overview
- Transaction history
- Mobile-responsive design

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

## Local Development Setup

1. Clone the repository:
```bash
git clone <your-repository-url>
cd robo-bank
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Deploying to Render

1. Create a Render account at https://render.com

2. Create a new Web Service:
   - Connect your GitHub repository
   - Select Node.js as the runtime
   - Set the build command: `npm install`
   - Set the start command: `npm start`
   - Add environment variables from your `.env` file

3. Deploy!

## Environment Variables

- `PORT`: Server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `JWT_EXPIRES_IN`: JWT token expiration time
- `NODE_ENV`: Environment (development/production)

## Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- CORS enabled
- Environment variables for sensitive data

## License

MIT 