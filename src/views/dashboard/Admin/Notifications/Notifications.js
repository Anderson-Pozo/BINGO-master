import React, { useState } from 'react';

import { Box } from '@mui/material';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { TabContext } from '@mui/lab';
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
            <Tab label="Generales" value="1" />
            <Tab label="Por Usuario" value="2" />
          </Tabs>
        </Box>
        <TabPanel value="1">
          <GeneralNotifications />
        </TabPanel>
        <TabPanel value="2">
          <UserNotifications />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Notifications;
