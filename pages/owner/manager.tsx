import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import Layout from '../../components/Layout';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic'
import { Pitch, Product, User } from '../../Models';
import { GiClothes, GiSoccerField, GiSonicShoes } from 'react-icons/gi';
import { RootState } from '../../redux/store';
import { IconButton, ImageList, ImageListItem, Tooltip, Typography } from '@mui/material';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FiEdit } from 'react-icons/fi';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import { setIsLoading, setIsUpdate } from '../../redux/features/isSlice';
import Router from 'next/router';
import { getCookie } from 'cookies-next';
import jwt from "jsonwebtoken"
const ConfirmModal = dynamic(() => import("../../components/Modals/ConfirmModal"), { ssr: false })
const AddUserModal = dynamic(() => import("../../components/Modals/AddUserModal"), { ssr: false })
const AddPitchModal = dynamic(() => import("../../components/Modals/AddPitchModal"), { ssr: false })
const AddProductModal = dynamic(() => import("../../components/Modals/AddProductModal"), { ssr: false })
const FormEditProductModal = dynamic(() => import("../../components/Modals/FormEditProductModal"), { ssr: false })
const FormEditPitchModal = dynamic(() => import("../../components/Modals/FormEditPitchModal"), { ssr: false })


interface State {
    tabData: User[] | Pitch[] | any
    tab: number
    idDeleting: string
    idEditing: string
    typeProduct: string
    pictures: string[]
}

const OwnerManager = () => {
    const token : any = getCookie("token")
    const data = jwt.decode(token) as { [ key : string]: string}
    const dispatch = useDispatch()
    const { user }: User | any = useSelector<RootState>(state => state?.user)
    const { isUpdated }: boolean | any = useSelector<RootState>(state => state.is)
    const [state, setState] = useState<State>({
        tabData: [],
        tab: 1,
        idDeleting: "",
        idEditing: "",
        typeProduct: "",
        pictures: []
    })
    const [openModalAddPitch, setModalAddPitch] = useState(false);
    const [openModalAddProduct, setModalAddProduct] = useState(false);
    const [openConfirmModal, setConfirmModal] = useState(false);
    const [openFormEditProductModal, setFormEditProductModal] = useState(false);
    const [openFormEditPitchModal, setFormEditPitchModal] = useState(false);

    const { tabData, tab, idDeleting, idEditing, typeProduct } = state


    useEffect(() => {
        if (!token) {
            Router.push("/")
        }
    }, [token])



    useEffect(() => {
        axios.get(`/api/${tab == 1 ? "pitch" : "products"}`)
            .then(res => res.data
            ).then((data) => {
                switch (tab) {
                    case 1: setState({ ...state, tabData: data.pitch?.filter((p: Pitch) => p.owner === user.id) })
                        dispatch(setIsLoading(false))
                        break
                    case 2: setState({ ...state, tabData: data.products?.filter((p: Product) => p.owner === user.id && p.type === "clothes") })
                        dispatch(setIsLoading(false))
                        break
                    case 3: setState({ ...state, tabData: data.products?.filter((p: Product) => p.owner === user.id && p.type === "sneakers") })
                        dispatch(setIsLoading(false))
                        break
                    default: return
                }
            })
            console.log("call api");
    }, [tab , isUpdated])


    const handleChange = (e: React.SyntheticEvent, newValue: number) => {
        setState({ ...state, tab: newValue });
    };

    const handleDelete = (id: any) => {
        setState({ ...state, idDeleting: id })
        setConfirmModal(true)
    };

    const handleShowModalAddClothes = () => {
        setState({ ...state, typeProduct: "clothes" })
        setModalAddProduct(true)
    }
    const handleShowModalAddShoes = () => {
        setState({ ...state, typeProduct: "sneakers" })
        setModalAddProduct(true)
    }

    const handleSetupFormEdit = (id: string) => {
        setState({ ...state, idEditing: id })
        if (tab === 1) {
            setFormEditPitchModal(true)
        } else {
            setFormEditProductModal(true)
        }
    }


    return (
            <Layout>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'fixed', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon className="text-primary" />}
                >
                    <SpeedDialAction
                        onClick={() => setModalAddPitch(true)}
                        icon={<GiSoccerField className="text-orange-500 text-3xl" />}
                        tooltipTitle="Add Pitch"
                    />
                    <SpeedDialAction
                        onClick={handleShowModalAddClothes}
                        icon={<GiClothes className="text-orange-500 text-3xl" />}
                        tooltipTitle="Add Clothes"
                    />
                    <SpeedDialAction
                        onClick={handleShowModalAddShoes}
                        icon={<GiSonicShoes className="text-orange-500 text-3xl" />}
                        tooltipTitle="Add Sneakers"
                    />
                </SpeedDial>

                {openModalAddPitch && <AddPitchModal open={openModalAddPitch} setOpen={setModalAddPitch} />}
                {openModalAddProduct && <AddProductModal type={typeProduct} open={openModalAddProduct} setOpen={setModalAddProduct} />}

                {openFormEditProductModal && <FormEditProductModal tab={tab} id={idEditing} open={openFormEditProductModal} setOpen={setFormEditProductModal} />}

                {openFormEditPitchModal && <FormEditPitchModal id={idEditing} open={openFormEditPitchModal} setOpen={setFormEditPitchModal} />}

                {openConfirmModal && <ConfirmModal tab={tab} id={idDeleting} open={openConfirmModal} setOpen={setConfirmModal} />}
                <div className="pt-16  overflow-hidden">
                    <Tabs value={tab} onChange={handleChange} aria-label="icon label tabs example">
                        <Tab value={1} icon={<GiSoccerField className="text-4xl" />} label="Pitch" />
                        <Tab value={2} icon={<GiClothes className="text-4xl" />} label="Clothes" />
                        <Tab value={3} icon={<GiSonicShoes className="text-4xl" />} label="Sneakers" />
                    </Tabs>
                    <table className="min-w-full overflow-hidden">
                        <thead>
                            <tr>
                                <th
                                    colSpan={1}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    ID</th>
                                <th
                                    colSpan={1}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    {"Name"}</th>
                                <th
                                    colSpan={3}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    {tab === 1 ? "Location" : "Description"}</th>

                                {tab !== 1 &&
                                    <th
                                        colSpan={2}
                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                        {"Price"}</th>

                                }
                                {tab !== 1 &&
                                    <th
                                        colSpan={2}
                                        className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                        {"Discount"}</th>
                                }

                                <th
                                    colSpan={2}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    {"Size"}</th>


                                <th
                                    colSpan={2}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    {"Pictures"}</th>
                                <th
                                    colSpan={2}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Edit</th>
                                <th
                                    colSpan={2}
                                    className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-center text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                                    Delete</th>
                            </tr>
                        </thead>

                        <tbody className="h-[10rem] overflow-y-scroll bg-white">
                            {tabData?.map((data: any, index: number) => (
                                <tr
                                    key={data.id}
                                >
                                    <td
                                        colSpan={1}
                                        className="px-6  whitespace-no-wrap border-b border-gray-200">
                                        <div className="text-sm leading-5 text-gray-500">{index + 1}</div>
                                    </td>
                                    <td
                                        colSpan={1}
                                        className="px-6  whitespace-no-wrap border-b border-gray-200">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <div className="text-sm font-medium leading-5 text-gray-900">
                                                    {data.name}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td
                                        colSpan={3}
                                        className="px-6  whitespace-no-wrap border-b border-gray-200">
                                        <div className="text-sm leading-5 text-gray-500">{tab === 1 ? data.location : data.description}</div>
                                    </td>
                                    {tab !== 1 &&
                                        <td
                                            colSpan={2}
                                            className="px-6  whitespace-no-wrap border-b border-gray-200">
                                            <div className="text-sm leading-5 text-gray-500"> {tab === 1 ? `${data.price}₫/h` : `${data.price}₫`}</div>
                                        </td>
                                    }
                                    {tab !== 1 &&
                                        <td
                                            colSpan={2}
                                            className="px-6  whitespace-no-wrap border-b border-gray-200">
                                            <div className="text-sm text-center leading-5 text-gray-500"> {`${data.discount}%`}</div>
                                        </td>
                                    }
                                    <td
                                        colSpan={2}
                                        className="px-6  whitespace-no-wrap border-b border-gray-200">
                                        <div className="text-sm leading-5 text-gray-500"> {`${data.size?.sort((a: number | string, b: number | string) => typeof a === "number" && typeof b === "number" ? a - b : data.size)}`}</div>
                                    </td>
                                    <td
                                        colSpan={2}
                                        className={`!h-40  whitespace-no-wrap border-b border-gray-200 ${tab !== 1 ? "!w-[25%]" : ""}`}>
                                        {tab === 0 ?
                                            <span
                                                className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">{data.role?.charAt(0).toUpperCase() + data.role?.substring(1)}</span>
                                            :
                                            <ImageList cols={data.pictures?.length >= 2 ? 2 : 1} className="!h-full">
                                                {tab === 1 &&
                                                    [data?.mainPicture, ...data?.pictures]?.map((item: string) => (
                                                        <ImageListItem key={item}>
                                                            <img
                                                                src={item}
                                                                alt=""
                                                                className="object-cover !h-40"
                                                                loading="lazy"
                                                            />
                                                        </ImageListItem>
                                                    ))
                                                }
                                                {tab !== 1 &&
                                                    [data?.mainPictures?.[0], data?.mainPictures?.[1], ...data?.pictures]?.map((item: string) => (
                                                        <ImageListItem key={item}>
                                                            <img
                                                                src={item}
                                                                alt=""
                                                                className="object-cover !h-40"
                                                                loading="lazy"
                                                            />
                                                        </ImageListItem>
                                                    ))
                                                }


                                            </ImageList>
                                        }
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="text-center  whitespace-no-wrap border-b border-gray-200">
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleSetupFormEdit(data.id)}
                                            >
                                                <FiEdit className="text-[#1976D2] text-3xl" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                    <td
                                        colSpan={2}
                                        className="text-center  whitespace-no-wrap border-b border-gray-200">
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDelete(data.id)}
                                            >
                                                <RiDeleteBin6Line className="text-[#f87171] text-3xl" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </Layout >
           
    );
}



export default OwnerManager




