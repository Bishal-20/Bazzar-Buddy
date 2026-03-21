import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { IoCloseSharp, IoCloudUpload } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { postData } from "../../utils/api";
import { MyContext } from "../../App";

const AddHomeSlide = () => {
  const context = useContext(MyContext);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const [formFields, setFormFields] = useState({
    images: [],
  });

  const onChangeFile = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFile(files);
    setPreview(URL.createObjectURL(files[0])); // show first image only
  };

  const removeImage = () => {
    setFile(null);
    setPreview("");
  };

  const addHomeSlide = async (e) => {
    e.preventDefault();

    if (!file || file.length === 0) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return;
    }

    const formData = new FormData();
    Array.from(file).forEach((f) => formData.append("images", f));

    try {
      setIsLoading(true);
      await postData("/api/homeBanner", formData); // backend handles upload
      navigate("/homeBannerSlide");
    } catch (err) {
      console.error(err);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "HomeBanner creation failed",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const StyledBreadcrumb = styled(Chip)(({ theme }) => ({
    backgroundColor: theme.palette.grey[100],
    height: theme.spacing(3),
    color: (theme.vars || theme).palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
    },
  }));

  return (
    <div className="productContent w-100 res-col">
      <div className="card shadow border-0 w-100 p-4">
        <h4>Add HomeBanner</h4>
        <div className="ml-auto d-flex align-items-center presentation breadcrumbs">
          <Breadcrumbs aria-label="breadcrumb">
            <StyledBreadcrumb
              component="a"
              href="/"
              label="Dashboard"
              icon={<HomeIcon fontSize="small" />}
            />
            <StyledBreadcrumb component="a" href="/homeBanner" label="Home Slides" />
          </Breadcrumbs>
        </div>
      </div>

      <form className="form" onSubmit={addHomeSlide}>
        <div className="card p-4 mt-3 col-sm-9">
          <h6 className="mt-4">HOMEBANNER IMAGE</h6>
          <div className="imgUploadBox d-flex align-items-center">
            {preview ? (
              <div className="uploadBox">
                <span className="remove" onClick={removeImage}>
                  <IoCloseSharp />
                </span>
                <LazyLoadImage alt="preview" effect="blur" className="w-100" src={preview} />
              </div>
            ) : (
              <div className="uploadBox">
                <input type="file" name="images" multiple onChange={onChangeFile} />
                <div className="info">
                  <FaRegImages className="svg" />
                  <h5>Upload Image</h5>
                </div>
              </div>
            )}
          </div>

          <Button type="submit" className="btn-pink btn-big btn-lg w-100 mt-4" disabled={isLoading}>
            <IoCloudUpload /> &nbsp;
            {isLoading ? "Uploading..." : "PUBLISH AND VIEW"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddHomeSlide;
