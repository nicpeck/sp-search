import _ from 'lodash';

import {
    Flex,
    Box,
    LinkOverlay,
    LinkBox,
    Image,
    Text,
} from '@chakra-ui/react'

const SearchItem = ({ item }) => {
    const linkable = !!item.preview_url;
    // if (!linkable) return null;
    
    return (
        <LinkBox as="article" p={2} borderWidth={1} borderRadius={2} my={2} _hover={linkable ? { boxShadow: 'md' } : undefined}>
            <Flex dir="row">
                <Image src={_.get(item, 'album.images[0].url')} height="auto" width="auto" maxHeight={120} mr={3} borderRadius={2} />
                <Box flexGrow={1} lineHeight={1.2} color={linkable ? undefined : 'gray.400'}>
                    <Box mb={1} size="lg" fontWeight="bold">
                        <LinkOverlay href={_.get(item, 'preview_url')}>
                            {_.get(item, 'name')}
                        </LinkOverlay>
                    </Box>
                    <Box mb={2}>
                        <Text size="md">{item.artists.map(artist => artist.name).join(', ')}</Text>
                    </Box>
                    <Box mb={1}>
                        <Text size="sm">
                            {item.album.name}
                            &nbsp;&middot;&nbsp;
                            {item.album.release_date.substring(0, 4)}
                        </Text>
                    </Box>
                </Box>
            </Flex>
        </LinkBox>
    )
};

export default SearchItem;