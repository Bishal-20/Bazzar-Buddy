import React, { useContext , useState , useEffect } from 'react';
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { MyContext } from '../../App';
import {IoCloudUpload } from "react-icons/io5";
import { postData } from "../../utils/api";
import { useNavigate} from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { useParams} from "react-router-dom";
import { fetchDataFromApi, editData } from "../../utils/api";




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

const EditSubCat=()=>{

    const[data , setData] = useState([]);
    const [categoryVal, setcategoryVal] = useState('');
    const [isLoading , setIsLoading]=useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [formFields, setFormFields] = useState({
        category: "",
        subCat:"",
      });

    const context = useContext(MyContext);

        useEffect(() => {
        context.setProgress(20);
        fetchDataFromApi(`/api/subCat/${id}`).then((res) => {
          setData(res);
          setcategoryVal(res.category.id);
          setFormFields(()=>({
            ...formFields,
           category:res.category.id,
           subCat:res.subCat,
        }))


        })
        context.setProgress(100);
    },[])  

    const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(()=>({
        ...formFields,
        category:event.target.value
    }))
    };

        const inputChange=(e)=>{
        setFormFields(()=>({
            ...formFields,
            [e.target.name]:e.target.value
        }))
    };


    const updateSubCat = async (e) => {
    e.preventDefault();

    if (!formFields.category || !formFields.subCat) {
        context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
        });
        return;
    }

    try {
        setIsLoading(true);

        await editData(`/api/subCat/${id}`, {
        category: formFields.category,
        subCat: formFields.subCat,
        });

        context.setAlertBox({
        open: true,
        error: false,
        msg: "Sub category updated successfully",
        });

        navigate("/subCat"); // go back to subcategory list
    } catch (error) {
        context.setAlertBox({
        open: true,
        error: true,
        msg: "Failed to update sub category",
        });
        console.error(error);
    } finally {
        setIsLoading(false);
    }
};



    return(
        <>
        <div className="productContent w-100 res-col">
            <div className="card shadow border-0 w-100 p-4">
                <h4>Edit Sub Category</h4>
                <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
                        <Breadcrumbs aria-label="breadcrumb">
                            <StyledBreadcrumb
                                component="a"
                                href="/"
                                label="Dashboard"
                                className='breadcrumbs'
                                icon={<HomeIcon fontSize="small" />}
                            />
                            <StyledBreadcrumb component="a" href={`/subCat/edit/${id}`} label="Edit Sub Category" className='breadcrumbs'/>
                        </Breadcrumbs>
                </div>  
            </div>

            <form onSubmit={updateSubCat}>
                <div className='row'>
                    <div className='col-sm-9'>
                        <div className='card p-4 mt-0'>
                            <div className='col'>
                                <div className='form-group'>
                                <h6>CATEGORY</h6>
                                <Select
                                value={categoryVal}
                                onChange={handleChangeCategory}
                                displayEmpty
                                inputProps={{ 'aria-label': 'Without label' }}
                                className='w-100'
                                name='category'
                                >
                                <MenuItem value="">
                                <em>None</em>
                                </MenuItem>
                                {
                                    context.catData?.categoryList?.length !== 0 &&
                                    context.catData.categoryList.map((cat, index) => {

                                        return(
                                            <MenuItem key={cat._id} value={cat._id}>
                                                {cat.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                                </Select>
                                </div>  
                            </div>
                            <div className='col'>
                                <div className='form-group'>
                                <h6>SUB CATEGORY</h6>
                                <input type="text" className='form-control' placeholder='Type here' name="subCat" value={formFields.subCat} onChange={inputChange}/>
                                </div>
                            </div> 

                            <Button type='submit' className="btn-pink btn-lg btn-big w-100"><IoCloudUpload /> &nbsp; {isLoading===true ?  <CircularProgress color="inherit" className="loader" /> : 'PUBLISH AND VIEW'}</Button>   
                        </div>
                        
                    </div>
                    
                </div>
            </form>
        </div>
        </>
    )
}

export default EditSubCat;