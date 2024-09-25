import { BASE_URL } from '@/config/config';
import { ApolloClient, InMemoryCache} from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
  uri: `${BASE_URL}/graphql`, 
  credentials: 'same-origin',
});


const client = new ApolloClient({
  link: uploadLink,
  cache: new InMemoryCache(),
});

export default client;
