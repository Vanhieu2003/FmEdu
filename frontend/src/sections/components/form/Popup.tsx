import React, { useState } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type PopupProps = {
  title: string;
  children: React.ReactNode;
  openPopup: boolean;
  formId?:string
  setOpenPopup: (open: boolean) =>void;
};

const Popup = ({ title, children, openPopup,formId, setOpenPopup}: PopupProps) => {
  return (
    <Dialog open={openPopup} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography>{title}</Typography>
          {setOpenPopup && <Button onClick={() => setOpenPopup(false)}><CloseIcon /></Button>}
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ overflowY: 'visible' }} >
      {children}
      </DialogContent>
    </Dialog>
  );
};

export default Popup;
