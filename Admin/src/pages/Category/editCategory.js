import React, { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { IoCloseSharp, IoCloudUpload } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa";
import CircularProgress from "@mui/material/CircularProgress";
import { useParams, useNavigate } from "react-router-dom";
import { fetchDataFromApi, editData } from "../../utils/api";
import { MyContext } from "../../App";
import {Link} from "react-router-dom";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [existingImage, setExistingImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [formFields, setFormFields] = useState({
    name: "",
    color: ""
  });

  useEffect(() => {
    context.setProgress(20);
    fetchDataFromApi(`/api/category/${id}`).then((res) => {
      setFormFields({
        name: res.name,
        color: res.color
      });
      if (res.images && res.images.length > 0) {
        const firstImage = res.images[0]?.images?.[0]?.url || "";
        setExistingImage(firstImage);
      }
      context.setProgress(100);
    });
  }, [id]);

  const changeInput = (e) => {
    setFormFields({
      ...formFields,
      [e.target.name]: e.target.value
    });
  };

  const onChangeFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Only image files (jpg, jpeg, png, webp) are allowed"
      });
      return;
    }

    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeExistingImage = () => {
    setExistingImage("");
  };

  const removeNewImage = () => {
    setNewImage(null);
    setPreview("");
  };

  const editCategory = async (e) => {
    e.preventDefault();

    if (!formFields.name || !formFields.color || (!existingImage && !newImage)) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details"
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", formFields.name);
    formData.append("color", formFields.color);

    if (newImage) {
      formData.append("images", newImage);
    }

    formData.append("deleteOldImage", existingImage ? "false" : "true");

    try {
      setIsLoading(true);
      await editData(`/api/category/${id}`, formData);
      navigate("/category");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
    <div className="productContent w-100 res-col">
      <div className="card shadow border-0 w-100 p-4">
        <h4>Edit Category</h4>
        <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
                <Breadcrumbs aria-label="breadcrumb">
                    <StyledBreadcrumb
                        component="a"
                        href="/"
                        label="Dashboard"
                        className='breadcrumbs'
                        icon={<HomeIcon fontSize="small" />}
                    />
                    <StyledBreadcrumb component="a" href="/product" label="Category" className='breadcrumbs'/>
                </Breadcrumbs>
                <Link to="/category/add"><Button className="btn-pink ml-3 pl-3 pr-3">ADD CATEGORY</Button></Link>
        </div>  
      </div>

      <form className="form" onSubmit={editCategory}>
        <div className="card p-4 mt-3">
          <div className="form-group">
            <h6>CATEGORY NAME</h6>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formFields.name}
              onChange={changeInput}
            />
          </div>

          <div className="form-group mt-3">
            <h6>COLOR</h6>
            <input
              type="text"
              className="form-control"
              name="color"
              value={formFields.color}
              onChange={changeInput}
            />
          </div>

          <h6 className="mt-4">CATEGORY IMAGE</h6>
          <div className="imgUploadBox d-flex">

            {existingImage && !newImage && (
              <div className="uploadBox">
                <img src={existingImage} className="w-100" />
                <span className="remove" onClick={removeExistingImage}>
                  <IoCloseSharp />
                </span>
              </div>
            )}

            {preview && (
              <div className="uploadBox">
                <img src={preview} className="w-100" />
                <span className="remove" onClick={removeNewImage}>
                  <IoCloseSharp />
                </span>
              </div>
            )}

            {!preview && (
              <div className="uploadBox">
                <input type="file" onChange={onChangeFile} />
                <div className="info">
                  <FaRegImages />
                  <h5>Upload Image</h5>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="btn-pink btn-lg btn-big w-100 mt-4" disabled={isLoading}>
            <IoCloudUpload />
            &nbsp;
            {isLoading ? "Uploading..." : "UPDATE CATEGORY"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditCategory;
