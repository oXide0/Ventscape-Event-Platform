import { Avatar, Button, Card, Heading, Stack, Text } from '@chakra-ui/react';
import Loader from 'components/ui/Loader';
import PageLayout from 'components/ui/PageLayout';
import { useFetching } from 'hooks/useFetching';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getUserAvatar, getUserById } from 'services/userActions';
import { User } from 'types/types';

const UserPage = () => {
    const { userId } = useParams();
    const [user, setUser] = useState<User>();
    const [avatar, setAvatar] = useState<string>('');

    const { fetch, isLoading } = useFetching(async () => {
        if (userId) {
            const userServerData = await getUserById(userId);
            const avatar = await getUserAvatar(userId);
            if (userServerData) setUser(userServerData);
            if (avatar) setAvatar(avatar);
        }
    });

    useEffect(() => {
        fetch();
    }, []);

    if (isLoading || !user) return <Loader />;

    return (
        <PageLayout>
            <Card p={3}>
                <Heading size='md'>Personal info</Heading>
                <Stack direction='row' alignItems='center' gap={6} pt={3}>
                    <Avatar size='xl' src={avatar} />
                    <Heading size='xl'>{user.name}</Heading>
                </Stack>
            </Card>
            <Card p={3} mt={4}>
                <Heading size='md'>About</Heading>
                <Text fontSize='lg'>{user.about}</Text>
            </Card>
            <Stack pt={6}>
                <Button colorScheme='brand' color='text.white'>
                    Follow
                </Button>
            </Stack>
        </PageLayout>
    );
};

export default UserPage;
