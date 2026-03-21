import React, { useContext , useEffect, useState } from 'react';
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import { MyContext } from '../../App';
import {IoCloudUpload } from "react-icons/io5";
import { deleteData, editData, fetchDataFromApi, postData } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
        backgroundColor: theme.palette.grey[100],
        height: theme.spacing(3),
        color: (theme.vars || theme).palette.text.primary,
        fontWeight: theme.typography.fontWeightRegular,
        '&:hover, &:focus': {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
        ...theme.applyStyles('dark', {
            backgroundColor: emphasize(theme.palette.grey[800], 0.06),
        }),
        },
        '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
        ...theme.applyStyles('dark', {
            backgroundColor: emphasize(theme.palette.grey[800], 0.12),
        }),
        },
        ...theme.applyStyles('dark', {
        backgroundColor: theme.palette.grey[800],
        }),
    };
    });

const AddProductWeight=()=>{
    const [editId , setEditId] = useState('');
    const [isLoading , setIsLoading]=useState(false);
    const [productWeightData , setProductWeightData] = useState([]);
    const [formFields, setFormFields] = useState({
        productWeight:'',
      });

    const context = useContext(MyContext);

        const inputChange=(e)=>{
        setFormFields(()=>({
            ...formFields,
            [e.target.name]:e.target.value
        }))
    };

    useEffect(()=>{
        fetchDataFromApi('/api/productWeight').then((res)=>{
        setProductWeightData(res);
    })
    },[]);

    const updateData= async(id)=>{
        await fetchDataFromApi(`/api/productWeight/${id}`).then((res)=>{
            setEditId(id);
            setFormFields({
                productWeight:res.productWeight,
            });
        })
    }


    const addProdutWeight = async (e) => {
  e.preventDefault();

  if (!formFields.productWeight) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Please fill all the details",
    });
    return;
  }

  try {
    setIsLoading(true);

    if (editId === '') {
      await postData("/api/productWeight/create", {
        productWeight: formFields.productWeight,
      });
    } else {
      await editData(`/api/productWeight/${editId}`, formFields);
      setEditId('');
    }
    const res = await fetchDataFromApi('/api/productWeight');
    setProductWeightData(res);

    setFormFields({ productWeight: '' });

    context.setAlertBox({
      open: true,
      error: false,
      msg: editId ? "Product Weight updated successfully" : "Product Weight added successfully",
    });

  } catch (error) {
    context.setAlertBox({
      open: true,
      error: true,
      msg: "Operation failed",
    });
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

    const deleteItem= async (id)=>{
        await deleteData(`/api/productWeight/${id}`).then((res)=>{
            fetchDataFromApi('/api/productWeight').then((res)=>{
            setProductWeightData(res);
            });
        })
    }


    return(
        <>
        <div className="productContent w-100 res-col">
            <div className="card shadow border-0 w-100 p-4">
                <h4>Add Product Weight</h4>
                <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                className='breadcrumbs'
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href="/productWeight/list" label="ProductWeight" className='breadcrumbs'/>
                        </Breadcrumbs>
                        <Link to="/productWeight/add"><Button className="btn-pink ml-3 pl-3 pr-3">ADD PRODUCT WEIGHT</Button></Link>
                </div>  
            </div>

            <form onSubmit={addProdutWeight} className='form'>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>

                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <h6>PRODUCT WEIGHT</h6>
                                        <input type="text" className='form-control' placeholder='Type here' name="productWeight" value={formFields.productWeight} onChange={inputChange}/>
                                    </div>
                                </div>
                                
                            </div> 

                            <Button type='submit' className="btn-pink btn-lg btn-big w-100"><IoCloudUpload /> &nbsp; {isLoading===true ?  <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>   
                        </div>
                        
                    </div>
                    
                </div>
            </form>

                {
                    productWeightData?.length !==0 && 
                    <div className='row'>
                        <div className='col-md-9'>
                            <div className='card p-4 mt-0'>
                            <div className='table-responsive mt-3'>
                                <table className='table table-bordered v-align'>
                                    <thead className='thead-dark'>
                                    <tr>
                                        <th>UID</th>
                                        <th width="25%">PRODUCT WEIGHT</th>
                                        <th>ACTION</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            productWeightData?.map((item , index)=>{
                                                return(
                                                    <tr key={item.id || index}>
                                                    <td>
                                                        {index+1}
                                                    </td>
                                                    <td>
                                                        {item.productWeight}
                                                    </td>
                                                    <td>
                                                        <div className='actions d-flex align-items-center'>
                                                        <Button className='success'  color='success' onClick={()=>updateData(item.id)}><FaPencilAlt /></Button>
                                                        <Button className='error' color='error' onClick={()=>deleteItem(item.id)}><MdDelete /></Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                            </div>
                        </div>
                    </div>
                }
        </div>
        </>
    )
}

export default AddProductWeight;