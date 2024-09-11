"use client"

import { FormControlLabel, Radio, RadioGroup, Rating } from '@mui/material';
import React, { useState } from 'react'

interface Props {
    criteriaID?: string;
    inputRatingType: string;
    disabled?:boolean;
}

const RenderRatingInput = ({ criteriaID,inputRatingType,disabled=false }: Props) => {
    const [ratingValues, setRatingValues] = useState<Record<string,any>>({});

    const handleValueChange = (criteriaID: string, value: any) => {
      setRatingValues(prevValues => ({
        ...prevValues,
        [criteriaID]: value,
      }));
    };
    switch (inputRatingType) {
        case "BINARY":
          return (
            <RadioGroup
              row
              value={ratingValues[criteriaID?criteriaID:0] || ''}
              onChange={(e) => handleValueChange(criteriaID?criteriaID:'', e.target.value)}
            >
              <FormControlLabel value="Đạt" control={<Radio />} label="Đạt" sx={{margin:0}} disabled={disabled} />
              <FormControlLabel value="Không đạt" control={<Radio />} label="Không đạt" sx={{margin:0}} disabled={disabled} />
            </RadioGroup>
          );
        case "RATING":
          return (
            <Rating
              value={ratingValues[criteriaID?criteriaID:0] || 0}
              onChange={(event, newValue) => handleValueChange(criteriaID?criteriaID:'', newValue)}
              disabled={disabled}
            />
          );
        default:
          return null;
      }
}

export default RenderRatingInput;