import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
// import { useTranslation } from "react-i18next";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 200,
        },
    },
};


export default function ProvinceSearchDropdown(props) {
    // const { t } = useTranslation();
    const { sorts, onSelectedSortChange, selectedSort, label } = props;

    return (
        <div className='sort-province-solution'>
            <FormControl sx={{ m: 1, width: 300 }}>
                <InputLabel id="demo-multiple-checkbox-label">{label}</InputLabel>
                <Select
                    labelId="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    className='bg-[#F9FBFF]'
                    value={selectedSort || ''}
                    onChange={onSelectedSortChange}
                    input={<OutlinedInput label={label} />}
                    //   InputProps={{
                    //     startAdornment: <InputAdornment position="start">Sort By:</InputAdornment>,
                    //   }}
                    renderValue={(selected) => selected}
                    MenuProps={MenuProps}
                >
                    <MenuItem value="All">
                        <ListItemText primary="All" />
                    </MenuItem>
                    {sorts && sorts.map((item, index) => (
                        <MenuItem key={index} value={item}>
                            <ListItemText primary={item.name} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </div>
    );
}