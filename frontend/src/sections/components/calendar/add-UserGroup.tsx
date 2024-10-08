import React, { useState } from 'react';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ColorPickerComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

interface AddCalendarItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, color: string) => void;
}

const AddCalendarItemDialog = ({ isOpen, onClose, onAdd }:AddCalendarItemDialogProps) => {
  const [newItemName, setNewItemName] = useState('');
  const [newItemColor, setNewItemColor] = useState('#000000');

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim(), newItemColor);
      setNewItemName('');
      setNewItemColor('#000000');
    }
  };

  return (
    <DialogComponent width="300px" isModal={true} visible={isOpen} close={onClose}>
      <div style={{ padding: '20px' }}>
        <h2>Thêm Calendar Item mới</h2>
        <TextBoxComponent
          placeholder="Nhập tên"
          value={newItemName}
          change={(e) => setNewItemName(e.value as string)}
        />
        <div style={{ marginTop: '10px' }}>
          <ColorPickerComponent
            value={newItemColor}
            change={(args) => setNewItemColor(args.currentValue.hex)}
          />
        </div>
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <ButtonComponent onClick={onClose} style={{ marginRight: '10px' }}>Hủy</ButtonComponent>
          <ButtonComponent isPrimary={true} onClick={handleAddItem}>Thêm</ButtonComponent>
        </div>
      </div>
    </DialogComponent>
  );
};

export default AddCalendarItemDialog;