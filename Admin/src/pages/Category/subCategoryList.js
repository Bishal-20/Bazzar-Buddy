import React, { useContext, useEffect, useState } from "react";
import  Button  from "@mui/material/Button";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Pagination from '@mui/material/Pagination';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import HomeIcon from '@mui/icons-material/Home';
import { emphasize, styled } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import { editData, fetchDataFromApi , deleteData} from "../../utils/api";
import {Link} from "react-router-dom";
import { MyContext } from "../../App";

const SubCategorylist=() => {
    const [subCatData , setSubCatData]= useState({
      subCategoryList: [],
      totalPages: 0,
      page: 1
    });

    const [page , setPage] = useState(1)

    const context= useContext(MyContext);

const loadCategories = async (pageNumber = 1) => {
  try {
    context.setProgress(40);

    const res = await fetchDataFromApi(`/api/subCat?page=${pageNumber}`);


    setSubCatData({
      subCategoryList: res.subCategoryList || [],
      totalPages: res.totalPages || 0,
      page: res.page || 1,
    });

    

    setPage(res.page || 1);

    context.setProgress(100);
  } catch (error) {
    context.setProgress(100);
    console.error(error);
  }
};

    

    useEffect(()=>{
      window.scrollTo(0,0);
      
      loadCategories(page);
      console.log(setSubCatData)
      
      
    },[page]);

    const deleteCat = (id) => {
      deleteData(`/api/subCat/${id}`).then(() => {
      loadCategories(page);
      });
    };

    const handleChange = (event , value)=>{
      context.setProgress(40);
        setPage(value);
      context.setProgress(100);
    }


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


    return (
      <>
        <div className='productContent w-100'>
                <div className='card shadow border-0 w-100  p-4 res-col'>
                    <h4>Sub Category List</h4>
                  <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
                            <Breadcrumbs aria-label="breadcrumb">
                                <StyledBreadcrumb
                                    component="a"
                                    href="/"
                                    label="Dashboard"
                                    className='breadcrumbs'
                                    icon={<HomeIcon fontSize="small" />}
                                />
                                <StyledBreadcrumb component="a" href="/subCat" label="Sub Category" className='breadcrumbs'/>
                            </Breadcrumbs>
                          <Link to="/subCat/add"><Button className="btn-pink ml-3 pl-3 pr-3">ADD SUB CATEGORY</Button></Link>
                    </div>  
                </div>
             <div className='card shadow border-0 p-3 mt-4'>

              <div className='table-responsive mt-3'>
                <table className='table table-bordered v-align'>
                  <thead className='thead-dark'>
                    <tr>
                      <th>UID</th>
                      <th>CATEGORY IMAGE</th>
                      <th>CATEGORY</th>
                      <th>SUB CATEGORY</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      subCatData?.subCategoryList?.length!==0 && subCatData?.subCategoryList?.map((item , index)=>{
                        return(
                      <tr key={item._id}>
                      <td>#{index+1}</td>
                      <td>
                        <div className="imgWrapper">
                          <img
                            src={
                              item.category?.images?.[0]?.images?.[0]?.url || "/no-image.png"
                            }
                            alt={item.subCat}
                            style={{ width: 80, height: 60, objectFit: "contain" }}
                          />
                        </div>
                      </td>
                     <td>
                        <div className='info'>
                           <h6>{item.category?.name}</h6>
                        </div>
                      </td>
                        <td>
                         {item.subCat}
                      </td>
                      <td>
                        <div className='actions d-flex align-items-center'>
                          <Link to={`/subCat/edit/${item.id}`}>
                            <Button className='success' color='success'><FaPencilAlt /></Button>
                          </Link>
                         
                          <Button className='error' color='error' onClick={()=>deleteCat(item._id)}><MdDelete /></Button>
                        </div>
                      </td>
                    </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
                {
                  subCatData?.totalPages > 1 && 
                  <div className='d-flex tableFooter'>
                  <Pagination
                    count={subCatData?.totalPages} page={page} color="primary" className="pagination"
                    showFirstButton showLastButton 
                    onChange={handleChange}
                  />
                </div>
                }
                
              </div>
        </div>
      </div>

    </>   
    );
}    

export default SubCategorylist;