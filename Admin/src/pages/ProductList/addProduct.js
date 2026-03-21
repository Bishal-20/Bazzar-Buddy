import React, { useContext, useEffect, useRef } from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Rating from "@mui/material/Rating";
import { IoCloseSharp, IoCloudUpload } from "react-icons/io5";
import { FaRegImages } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const ProductUpload = () => {
  const [categoryVal, setcategoryVal] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [subCatVal, setSubCatVal] = useState("");
  const [ratingsVal, setRatingVal] = useState(1);
  const [isFeaturedValue, setisFeaturedValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [productWeightData, setProductWeightData] = useState([]);
  const [previews, setPreviews] = useState([]);

  const history = useNavigate();
  const fileInputRef = useRef(null);

  const [formFields, setFormFields] = useState({
    name: "",
    subCat: "",
    description: "",
    images: [],
    brand: "",
    price: 0,
    oldPrice: 0,
    category: "",
    countInStock: "",
    rating: 0,
    isFeatured: false,
    discount: 0,
    productWeight: [],
    location: [],
  });

  const {
    catData,
    setAlertBox,
    subCatData,
    loadCategories,
    loadSubCategories,
  } = useContext(MyContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    getCountry("https://api.countrystatecity.in/v1/countries/IN/states", {
      headers: {
        "X-CSCAPI-KEY": process.env.REACT_APP_CSC_API_KEY,
      },
    });
    fetchDataFromApi("/api/productWeight").then((res) => {
      setProductWeightData(res);
    });
  }, []);

  const getCountry = async (url, options) => {
    try {
      const res = await axios.get(url, options);
      setCountryList(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    fetchDataFromApi("/api/productWeight").then((res) => {
      setProductWeightData(res);
    });
  }, []);

  useEffect(() => {
    if (!files.length) {
      setPreviews([]);
      return;
    }

    const objectUrls = files.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  const onChangeFile = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

    const invalidFiles = selectedFiles.filter(
      (file) => !allowedTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      setAlertBox({
        open: true,
        error: true,
        msg: "Only image files (JPG, PNG, WEBP) are allowed",
      });

      e.target.value = null; // reset file input
      return;
    }

    setFiles(selectedFiles);
  };

  const handleChangeCategory = (event) => {
    setcategoryVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      category: event.target.value,
    }));
  };
  const handleChangeSubCategory = (event) => {
    setSubCatVal(event.target.value);
    setFormFields(() => ({
      ...formFields,
      subCat: event.target.value,
    }));
  };

  const handleChangeproductWeight = (event) => {
    const {
      target: { value },
    } = event;

    setFormFields((prev) => ({
      ...prev,
      productWeight: typeof value === "string" ? value.split(",") : value,
    }));
  };

  const handleChangeisFeaturedValue = (event) => {
    setisFeaturedValue(event.target.value);
    setFormFields(() => ({
      ...formFields,
      isFeatured: event.target.value,
    }));
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (
      !formFields.name ||
      !formFields.description ||
      !formFields.subCat ||
      !formFields.brand ||
      !formFields.price ||
      !formFields.oldPrice ||
      !formFields.category ||
      !formFields.countInStock ||
      !formFields.location ||
      files.length === 0 ||
      !formFields.discount
    ) {
      setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return;
    }
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", formFields.name);
      formData.append("subCat", formFields.subCat);
      formData.append("description", formFields.description);
      formData.append("brand", formFields.brand);
      formData.append("price", formFields.price);
      formData.append("oldPrice", formFields.oldPrice);
      formData.append("category", formFields.category);
      formData.append("countInStock", formFields.countInStock);
      formData.append("rating", ratingsVal);
      formData.append("isFeatured", isFeaturedValue);
      formData.append("discount", formFields.discount);
      formFields.productWeight.forEach((id) => {
        formData.append("productWeight[]", id);
      });
      formFields.location.forEach((state) => {
        formData.append("location[]", state);
      });

      files.forEach((file) => {
        formData.append("images", file);
      });

      await postData("/api/product/create", formData);
      await loadCategories();
      await loadSubCategories();

      setAlertBox({
        open: true,
        msg: "Product created successfully!",
        error: false,
      });

      setFormFields({
        name: "",
        subcat: "",
        description: "",
        images: [],
        brand: "",
        price: 0,
        oldPrice: 0,
        category: "",
        countInStock: "",
        rating: 0,
        isFeatured: false,
        discount: 0,
        productWeight: [],
        location: [],
      });

      history("/product");

      setFiles([]);
      setcategoryVal("");
      setSubCatVal("");
      setRatingVal(1);
      setisFeaturedValue("");
      setIsLoading(false);
    } catch (error) {
      console.error(error);

      setAlertBox({
        open: true,
        msg: "Product upload failed!",
        error: true,
      });

      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
    loadSubCategories();
  }, []);

  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    return {
      backgroundColor: theme.palette.grey[100],
      height: theme.spacing(3),
      color: (theme.vars || theme).palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      "&:hover, &:focus": {
        backgroundColor: emphasize(theme.palette.grey[100], 0.06),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.06),
        }),
      },
      "&:active": {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(theme.palette.grey[100], 0.12),
        ...theme.applyStyles("dark", {
          backgroundColor: emphasize(theme.palette.grey[800], 0.12),
        }),
      },
      ...theme.applyStyles("dark", {
        backgroundColor: theme.palette.grey[800],
      }),
    };
  });
  return (
    <>
      <div className="productContent w-100 res-col">
        <div className="card shadow border-0 w-100 p-4">
          <h4>Product Upload</h4>
          <nav className="breadcrumbs">
            <div role="presentation">
              <Breadcrumbs aria-label="breadcrumb">
                <StyledBreadcrumb
                  component="a"
                  href="/"
                  label="Dashboard"
                  icon={<HomeIcon fontSize="small" />}
                />
                <StyledBreadcrumb
                  component="a"
                  href="/product"
                  label="Product"
                />
                <StyledBreadcrumb
                  component="a"
                  href="/product/upload"
                  label="Product Upload"
                />
              </Breadcrumbs>
            </div>
          </nav>
        </div>

        <form className="form" onSubmit={addProduct}>
          <div className="row">
            <div className="col-sm-9">
              <div className="card p-4">
                <h5 className="mb-4">Basic Information</h5>
                <div className="form-group mt-3">
                  <h6>PRODUCT NAME</h6>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter product title"
                    name="name"
                    value={formFields.name}
                    onChange={inputChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <h6>DESCRIPTION</h6>
                  <textarea
                    className="form-control"
                    rows={4}
                    placeholder="Enter product description"
                    name="description"
                    value={formFields.description}
                    onChange={inputChange}
                  ></textarea>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>CATEGORY</h6>
                      <Select
                        value={categoryVal}
                        onChange={handleChangeCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {catData?.categoryList?.length !== 0 &&
                          catData.categoryList.map((cat, index) => {
                            return (
                              <MenuItem key={cat._id} value={cat._id}>
                                {cat.name}
                              </MenuItem>
                            );
                          })}
                      </Select>
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group">
                      <h6>SUB CATEGORY</h6>
                      <Select
                        value={subCatVal}
                        onChange={handleChangeSubCategory}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {subCatData?.subCategoryList?.length !== 0 &&
                          subCatData.subCategoryList.map((cat, index) => (
                            <MenuItem key={cat._id} value={cat._id}>
                              {cat.subCat}
                            </MenuItem>
                          ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>BRAND</h6>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type here"
                        name="brand"
                        value={formFields.brand}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>REGULAR PRICE</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type here"
                        name="oldPrice"
                        value={formFields.oldPrice}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>DISCOUNT PRICE</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type Here"
                        name="price"
                        value={formFields.price}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6 className="text-uppercase">is Featured</h6>
                      <Select
                        value={isFeaturedValue}
                        onChange={handleChangeisFeaturedValue}
                        displayEmpty
                        inputProps={{ "aria-label": "Without label" }}
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        <MenuItem value={true}>True</MenuItem>
                        <MenuItem value={false}>False</MenuItem>
                      </Select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>PRODUCT STOCK</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type Here"
                        name="countInStock"
                        value={formFields.countInStock}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <div className="form-group">
                      <h6>RATINGS</h6>
                      <Rating
                        name="simple-controlled"
                        value={ratingsVal}
                        onChange={(event, newValue) => {
                          setRatingVal(newValue);
                          setFormFields(() => ({
                            ...formFields,
                            rating: newValue,
                          }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>DISCOUNT</h6>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Type Here"
                        name="discount"
                        value={formFields.discount}
                        onChange={inputChange}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>PRODUCT WEIGHT</h6>
                      <Select
                        multiple
                        value={formFields.productWeight}
                        onChange={handleChangeproductWeight}
                        displayEmpty
                        MenuProps={MenuProps}
                        className="w-100"
                      >
                        {productWeightData?.map((item, index) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.productWeight} {/* display name */}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <h6>PRODUCT LOCATION</h6>
                      <Select
                        multiple
                        value={formFields.location}
                        onChange={(e) =>
                          setFormFields((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        displayEmpty
                        className="w-100"
                      >
                        {countryList.map((item) => (
                          <MenuItem key={item.iso2} value={item.name}>
                            {item.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <br />
              <div className="card p-4 mt-0">
                <div className="imagesUploadSec">
                  <h6 className="mb-4">Media And Published</h6>
                  <div className="imgUploadBox d-flex align-items-center">
                    {previews.map((img, index) => (
                      <div className="uploadBox" key={index}>
                        <span
                          className="remove"
                          onClick={() => {
                            setFiles((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                            setPreviews((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                        >
                          <IoCloseSharp />
                        </span>

                        <div className="box">
                          <LazyLoadImage
                            alt="preview"
                            effect="blur"
                            className="w-100"
                            src={img}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="uploadBox">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={onChangeFile}
                        name="images"
                      />
                      <div className="info">
                        <FaRegImages className="svg" />
                        <h5>Image Upload</h5>
                      </div>
                    </div>
                  </div>
                  <br />
                  <Button
                    type="submit"
                    className="btn-pink btn-lg btn-big w-100"
                  >
                    <IoCloudUpload /> &nbsp;{" "}
                    {isLoading === true ? (
                      <CircularProgress color="inherit" className="loader" />
                    ) : (
                      "PUBLISH AND VIEW"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductUpload;
