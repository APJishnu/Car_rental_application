import { BASE_URL } from '@/config/config';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: `${BASE_URL}/graphql`, // Update with your GraphQL endpoint
  cache: new InMemoryCache(),
});

export default client;
