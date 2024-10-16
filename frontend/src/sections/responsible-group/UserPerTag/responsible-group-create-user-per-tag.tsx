'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import { useState } from 'react';
import {
  Button
} from '@mui/material';

import Popup from '../../components/form/Popup';
import AddUserPerTag from '../../components/form/AddUserPerTag';
import UserPerTagListView from '../../components/userPerTag/userPerTagListView';

// ----------------------------------------------------------------------

export default function UserPerTagCreate() {
  const settings: any = useSettingsContext();
  const [openPopUp, setOpenPopUp] = useState(false);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ marginTop: '10px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant='h4'>Danh sách các nhóm tag đã tạo</Typography>
          <Button
            variant='contained'
            onClick={() => setOpenPopUp(true)}
          >
            Tạo mới
          </Button>
          <Popup
            title='Thêm người chịu trách nhiệm cho từng Tag'
            openPopup={openPopUp}
            setOpenPopup={setOpenPopUp} >
            <AddUserPerTag setOpenPopup={setOpenPopUp} />
          </Popup>
        </Box>
        <Box>
          <UserPerTagListView />
        </Box>
      </Box>
    </Container>
  );
}
