"use client"

import { FormControlLabel, Radio, RadioGroup, Rating } from '@mui/material';
import React, { useEffect, useState } from 'react'

interface Props {
    criteriaID?: string;
    inputRatingType: string;
    disabled?:boolean;
    value:any;
    onValueChange?: (criteriaId: string, value: any) => void;
}

const RenderRatingInput = ({ criteriaID,inputRatingType,disabled=false,value,onValueChange }: Props) => {
    const [ratingValues, setRatingValues] = useState<{[key:string]:any}>({});
    const handleChange = (value: any) => {
      onValueChange?.(criteriaID?criteriaID:'', value);
    };
    useEffect(() => {
        console.log("ratingvalue:", ratingValues);
    }, [ratingValues]);
    switch (inputRatingType) {
        case "BINARY":
          return (
            <RadioGroup
              row
              value={value.toString()}
              onChange={(e) => handleChange(Number(e.target.value))}
            >
              <FormControlLabel value="2" control={<Radio />} label="Đạt" sx={{margin:0}} disabled={disabled} />
              <FormControlLabel value="1" control={<Radio />} label="Không đạt" sx={{margin:0}} disabled={disabled} />
            </RadioGroup>
          );
        case "RATING":
          return (
            <Rating
              value={value || 0}
              onChange={(event, newValue) => handleChange(newValue)}
              disabled={disabled}
            />
          );
        default:
          return null;
      }
}

export default RenderRatingInput;