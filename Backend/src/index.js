import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema.js';
import resolvers from './resolvers.js';
import postsRouter from './routes/posts.js';
import usersRouter from './routes/users.js';
import webhookRoutes from './routes/webhook.js';
import bodyParser from 'body-parser';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.use('/webhooks/clerk', bodyParser.raw({ type: '*/*' }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());

app.get('/', (req, res) => res.send('API is running'));

// Mount routers
app.use('/api/posts', postsRouter);
app.use('/webhooks', webhookRoutes);
app.use('/api/users', usersRouter);

// GraphQL
app.use('/graphql', graphqlHTTP({
  schema,
  rootValue: resolvers,
  graphiql: true,
}));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
