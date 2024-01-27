import { Heading, Stack } from '@chakra-ui/react';
import EventCard from 'components/EventCard';
import FiltersBar from 'components/FiltersBar';
import Loader from 'components/ui/Loader';
import PageLayout from 'components/ui/PageLayout';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetEventsByCreatorIdQuery } from 'services/eventApi';
import { IEvent } from 'shared/types';
import { EventsFilter } from 'types/types';
import { filterEvents } from 'utils/events';

const UserEventsPage = () => {
    const { userId } = useParams();
    const [filteredEvents, setFilteredEvents] = useState<IEvent[]>([]);
    const { data: events, isLoading, error } = useGetEventsByCreatorIdQuery(userId);

    const onFilterEvents = (filterData: EventsFilter) => {
        if (!events) return;
        const filteredEvents = filterEvents(events, filterData);
        setFilteredEvents(filteredEvents);
    };

    useEffect(() => {
        if (events) {
            setFilteredEvents(events);
        }
    }, [events]);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <PageLayout heading='User Events'>
            <FiltersBar onFilter={onFilterEvents} />
            <Stack pt={10} gap={8}>
                {!filteredEvents.length || error ? (
                    <Heading textAlign='center' pt={10}>
                        Events not found!
                    </Heading>
                ) : (
                    <Stack direction='column' gap={8}>
                        {filteredEvents.map((event) => (
                            <EventCard key={event.id} {...event} />
                        ))}
                    </Stack>
                )}
            </Stack>
        </PageLayout>
    );
};

export default UserEventsPage;