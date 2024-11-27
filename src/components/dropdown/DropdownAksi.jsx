import React from 'react';
import Menu from '@mui/material/Menu';
import Button from "react-bootstrap/Button"
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
const DropdownAksi = ({ itemComponent }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <div>
            <ButtonGroup className='flex' >
                <button onClick={handleClick} style={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} className="bg-[#7752FE] text-white w-16 h-10 flex justify-center items-center">
                    Aksi
                </button>
                <button onClick={handleClick} style={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }} className="bg-[#7752FE] text-white w-8 h-10 flex justify-center items-center p-0 opacity-90">
                    {/* <img src={arrowDown} alt="" className="w-2.5" /> */}
                    <ArrowDropDownIcon/>
                </button>
            </ButtonGroup>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                    ".MuiList-root": {
                        minWidth: "120px"
                    }
                }}
            >
                <div onClick={handleClose}>
                    {itemComponent}
                </div>
            </Menu>
        </div>
    );
}

export default DropdownAksi;