import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ChakraProvider,
  Center,
  theme,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  Container,
  Spinner
} from '@chakra-ui/react';

import SearchItem from './SearchItem';

function App() {
  // const [apiClient, setApiClient] = useState(null);
  const [apiToken, setApiToken] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('api-token')) {
      const expires = new Date(window.localStorage.getItem('api-token-expires'));
      if (expires.valueOf() > Date.now() + 600000) {
        setApiToken(window.localStorage.getItem('api-token'));
      } else {
        window.localStorage.removeItem('api-token');
        window.localStorage.removeItem('api-token-expires');
      }
    }
  }, []);

  const enableSearch = apiToken;

  return (
    <ChakraProvider theme={theme}>
        <Container maxW="sm" my={20}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setLoading(true);
              const q = e.target[0].value;
              
              await axios.get('https://api.spotify.com/v1/search', {
                params: {
                  type: 'track',
                  q,
                  market: 'AU'
                },
                headers: {
                  Authorization: `Bearer ${apiToken}`,
                }
              })
              .then(({ data }) => {
                if (data && data.tracks) {
                  setSearchResults(data.tracks.items);
                }
              })
              .catch((err) => {
                alert(err.message);
              });


              setLoading(false);
            }}
          >
            <Input
              placeholder="Search..."
              type="search"
              disabled={!enableSearch}
              required
            />
            <Button type="submit" hidden disabled={!enableSearch}>Search</Button>
          </form>
          {loading && <Center my={8}><Spinner /></Center>}
          {searchResults && searchResults.map((item) => <SearchItem key={item.id} item={item} />)}
        </Container>
        <Modal
          isOpen={!apiToken}
        >
          <ModalOverlay />
          <ModalContent pt={6}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const clientDetails = {
                  id: e.target[0].value,
                  secret: e.target[1].value,
                };

                setLoading(true);

                const token = window.btoa(`${clientDetails.id}:${clientDetails.secret}`);
                await axios({
                  method: 'POST',
                  url: 'https://accounts.spotify.com/api/token',
                  data: 'grant_type=client_credentials',
                  headers: {
                    Authorization: `Basic ${token}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                  }
                })
                .then(({ data }) => {
                  if (data && data.access_token) {
                    setApiToken(data.access_token);
                    window.localStorage.setItem('api-token', data.access_token);
                    window.localStorage.setItem('api-token-expires', new Date(Date.now() + data.expires_in * 1000).toJSON());
                  }
                })
                .catch((err) => {
                  alert(err.message);
                });

                setLoading(false);
              }}
            >
              <ModalBody>
                <Input
                  placeholder="Client ID"
                  type="text"
                  name="client-id"
                  mb={4}
                  disabled={loading}
                  required
                />
                <Input
                  placeholder="Client secret"
                  type="password"
                  name="client-secret"
                  disabled={loading}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" type="submit" disabled={loading}>Save</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
    </ChakraProvider>
  );
}

export default App;
