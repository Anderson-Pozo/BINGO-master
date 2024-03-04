import React, { useState } from 'react';

import { Box } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
import { IconMessageChatbot, IconMessageShare, IconNotification } from '@tabler/icons';
import GeneralNotifications from './GeneralNotifications';
import { uiStyles } from './Notifications.styles';
import UserNotifications from './UserNotifications';

const Notifications = () => {
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={uiStyles.box}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            variant="scrollable"
            scrollButtons
            onChange={handleChange}
            aria-label="Tabs notifications"
            sx={{
              [`& .${tabsClasses.scrollButtons}`]: {
                '&.Mui-disabled': { opacity: 0.3 }
              }
            }}
          >
            <Tab icon={<IconNotification />} label="Notificaciones Generales" value="1" />
            <Tab icon={<IconMessageShare />} label="Notificaciones por Usuario" value="2" />
            <Tab icon={<IconMessageChatbot />} label="Notificaciones por Grupos" value="3" />
          </Tabs>
        </Box>
        <TabPanel value="1">
          <GeneralNotifications />
        </TabPanel>
        <TabPanel value="2">
          <UserNotifications />
        </TabPanel>
        <TabPanel value="3"></TabPanel>
      </TabContext>
    </Box>
  );
};

export default Notifications;
