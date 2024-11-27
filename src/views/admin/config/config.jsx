import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ContentCard from '../../../components/card-content/ContentCard';
import Button from "@mui/material/Button";
import EditIcon from '@mui/icons-material/Edit';
import api from "../../../service/api";
import ModalDetailConfig from "../../../components/modal-detail-gate/ModalDetailConfig";
import { isAuth } from "../../../utils/token";
import CustomTable from '../../../components/table/CustomTable';
const configPage = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [idData, setIdData] = useState("")
    const [name, setName] = useState("")
    const [title, setTitle] = useState("");
    const [value, setValue] = useState("");
    const [typeInput, setTypeInput] = useState("");
    function createData(no, name, value, type, action) {
        return { no, name, value, type, action };
    }
    const [configData, setConfigData] = useState([])
    const getDataConfig = async () => {
        setLoading(true)
        const token = isAuth()
        try {
            const response = await api.get(`/DbAppSetting`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setConfigData(response.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }
    useEffect(() => {
        getDataConfig()
    }, [])
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(Number(event.target.value));
        setPage(0);
    };
    const handleOpen = (id, name, title, value, type, date) => {
        setIdData(id)
        setName(name)
        setTitle(title);
        setValue(value);
        setTypeInput(type);
        setOpen(true);

    };
    const handleClose = () => setOpen(false);
    const handleEditData = async () => {
        const token = isAuth()
        try {
            setLoading(true);
            let formattedValue = value;
            if (typeInput === "Date") {
                const dateObject = new Date(value);
                formattedValue = dateObject.toISOString();
            }
            console.log(`data upddate>> ${formattedValue}, ${idData}, ${title}, ${typeInput}`);
            const updatedData = {
                id: idData,
                name: name,
                title: title,
                value: formattedValue,
                type: typeInput,
            };

            await api.put(`/DbAppSetting/${idData}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIdData('');
            setName('');
            setTitle('');
            setValue('');
            setTypeInput('');
            getDataConfig();
            handleClose();
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };
    const columns = [
        { id: "no", label: "No.", flex: 1 },
        {
            id: "name",
            label: "Title",
            flex: 1,
            align: "center",
        },
        {
            id: "type",
            label: "Type",
            flex: 1,
            align: "center",
        },
        {
            id: "value",
            label: "Value",
            flex: 1,
            align: "center",
        },
        {
            id: "action",
            label: "Action",
            flex: 1,
            align: "center",
        },
    ];

    const rows = configData.map((data, index) => {
        const displayValue = (data.type === 'boolean' ? (data.value === 'true' ? 'Yes' : 'No') : data.value) || (data.type === 'Date' ? data.value.split('T')[0] : data.value);
        return createData(
            index + 1,
            data.title,
            displayValue,
            data.type,
            <Button
                variant="contained"
                style={{ backgroundColor: '#1AACAC', padding: '2px' }}
                color="primary"
                size='small'
                onClick={() => {
                    handleOpen(data.id, data.name, data.title, data.value, data.type);
                }}
            >
                <EditIcon size='small' />
            </Button>

        );
    });
    const currentUrl = window.location.search;
    const urlParams = new URLSearchParams(currentUrl);
    return (
        <>
            <Helmet>
                <title>JoingateOCR | Config</title>
            </Helmet>

            <section className="bg-[#f3f4f7]  p-8 ml-4 mr-4 rounded-lg">
                <h3
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                    className="text-[#3d3d3d] font-bold text-2xl mb-4"
                >
                    CONFIG
                </h3>
                <ContentCard className="">
                    <CustomTable
                        columns={columns}
                        loading={loading}
                        rows={rows}
                        page={page}
                        rowsPerPage={rowsPerPage}
                        handleChangePage={handleChangePage}
                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </ContentCard>
            </section>
            <ModalDetailConfig
                open={open}
                handleClose={handleClose}
                name={name}
                title={title}
                value={value}
                typeInput={typeInput}
                setValue={setValue}
                handleEditData={handleEditData}
            />
        </>
    );
};

export default configPage;
