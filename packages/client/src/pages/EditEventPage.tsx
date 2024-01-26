import { useToast } from '@chakra-ui/react';
import EventForm, { EventFormValues } from 'components/EventForm';
import Loader from 'components/ui/Loader';
import PageLayout from 'components/ui/PageLayout';
import { selectUser } from 'features/userSlice';
import { useAppSelector } from 'hooks/redux-hooks';
import { useParams } from 'react-router-dom';
import { useGetEventByIdQuery, useUpdateEventMutation } from 'services/eventApi';
import { useUploadEventImageMutation, useRemoveEventImageMutation } from 'services/fileApi';

const EditEventPage = () => {
    const toast = useToast();
    const { eventId } = useParams();
    const { id } = useAppSelector(selectUser);
    const { data: event, isSuccess } = useGetEventByIdQuery(eventId);
    const [uploadEventImage] = useUploadEventImageMutation();
    const [removeEventImage] = useRemoveEventImageMutation();
    const [updateEvent] = useUpdateEventMutation();

    const handleSubmit = async (event: EventFormValues, img: File | null) => {
        try {
            if (!id) throw new Error('User not logged in.');
            if (!eventId) throw new Error('Event not found.');

            let imgData = null;

            if (img === null) {
                await removeEventImage(eventId).unwrap();
            } else {
                imgData = await uploadEventImage({ file: img }).unwrap();
            }
            await updateEvent({
                id: eventId,
                creatorId: id,
                imgId: imgData ? imgData.fileId : '',
                ...event,
            }).unwrap();
            toast({
                title: 'Event updated.',
                description: "We've updated your event for you.",
                status: 'success',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        } catch (err) {
            toast({
                title: 'An error occurred.',
                description: "We couldn't update your event, please try again later.",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    if (!isSuccess) {
        return <Loader />;
    }

    return (
        <PageLayout heading='Edit your event'>
            <EventForm submit={handleSubmit} eventData={event} imgUrl={null} />
        </PageLayout>
    );
};

export default EditEventPage;
