import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import EventCard from './Main/EventCard';
import { getGamesList } from 'config/firebaseEvents';
import MessageDark from 'components/message/MessageDark';

const Dashboard = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getGamesList();
        setEvents(data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <Grid container spacing={1}>
      {events.length > 0 ? (
        events.map((item) => (
          <Grid key={item.ide} item lg={3} md={4} sm={6} xs={12}>
            <EventCard
              name={item.name}
              date={item.startDate}
              bg="#00adef"
              id={item.ide}
              transmition={item.transmition}
              state={item.state}
            />
          </Grid>
        ))
      ) : (
        <Grid item xs={12} style={{ marginTop: 20 }}>
          <MessageDark message="No hay eventos aún!" submessage="" />
        </Grid>
      )}
    </Grid>
  );
};

export default Dashboard;
