'use client';

import React, { useEffect, useState } from 'react';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/js/plugins/char_counter.min.js';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/js/plugins/image.min.js';
import FroalaEditorComponent from 'react-froala-wysiwyg';


interface ContactProps {
  criteriaId: string;
  value: string;
  onNoteChange: (criteriaId: string, note: string) => void;
}

export default function Contact({ criteriaId, value, onNoteChange }: ContactProps) {
  const handleModelChange = (model: string) => {
    onNoteChange(criteriaId, model);
  };
  return (
    <FroalaEditorComponent
      model={value}
      onModelChange={handleModelChange}
      tag="textarea"
      config={{
        placeholder: 'Nhập tin nhắn của bạn tại đây',
        toolbarButtons: ['insertImage'],
        charCounterMax: 100,
      }}
    />
  );
}

