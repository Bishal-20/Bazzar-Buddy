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
import { editData, fetchDataFromApi, postData } from "../../utils/api";
import { MyContext } from "../../App";
import { Link, useParams, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";

const EditProduct = () => {
  const [ratingsVal, setRatingVal] = useState(1);
  const [countryList, setCountryList] = useState([]);
  const [isFeaturedValue, setisFeaturedValue] = useState("");
  const [productWeightData, setProductWeightData] = useState([]);
  const [productWeight, setProductWeight] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [existingImage, setExistingImage] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const history = useNavigate();

  const { catData, setAlertBox, setProgress, baseUrl, subCatData } =
    useContext(MyContext);

  let { id } = useParams();

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

  const handleRemoveImage = (imageId) => {
    setExistingImage((prev) => prev.filter((img) => img._id !== imageId));
  };

  const removeNewFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const inputChange = (e) => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  const editProduct = async (e) => {
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
      !formFields.discount ||
      !formFields.location ||
      (files.length === 0 && existingImage.length === 0)
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

      existingImage.forEach((img) => {
        formData.append("existingImages[]", img.public_id);
      });

      await editData(`/api/product/${id}`, formData);

      setAlertBox({
        open: true,
        msg: "Product updated successfully!",
        error: false,
      });

      setFormFields({
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

      history("/product");

      setFiles([]);
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
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setProgress(30);
        const product = await fetchDataFromApi(`/api/product/${id}`);
        setProgress(70);

        // populate form fields
        setFormFields({
          name: product.name || "",
          subCat: product.subCat?._id || "",
          description: product.description || "",
          images: product.images || [],
          brand: product.brand || "",
          price: product.price || 0,
          oldPrice: product.oldPrice || 0,
          category:
            typeof product.category === "object"
              ? product.category._id
              : product.category || "",
          countInStock: product.countInStock || "",
          rating: product.rating || 0,
          isFeatured: product.isFeatured || false,
          discount: product.discount || "",
          productWeight: product.productWeight
            ? product.productWeight.map((w) => w._id)
            : [],
          location: Array.isArray(product.location) ? product.location : [],
        });

        setRatingVal(product.rating || 1);
        setisFeaturedValue(product.isFeatured || false);

        // create previews for existing images
        setExistingImage(product.images?.images || []);

        setProgress(100);
      } catch (err) {
        setProgress(100);
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

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
          <h4>Edit Product</h4>
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
                  label="Edit Product"
                />
              </Breadcrumbs>
            </div>
          </nav>
        </div>

        <form className="form" onSubmit={editProduct}>
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
                        value={formFields.category}
                        onChange={(e) =>
                          setFormFields((prev) => ({
                            ...prev,
                            category: e.target.value,
                          }))
                        }
                        displayEmpty
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
                        value={formFields.subCat}
                        onChange={(e) =>
                          setFormFields((prev) => ({
                            ...prev,
                            subCat: e.target.value,
                          }))
                        }
                        displayEmpty
                        className="w-100"
                      >
                        <MenuItem value="">
                          <em>None</em>
                        </MenuItem>
                        {subCatData?.subCategoryList?.length !== 0 &&
                          subCatData.subCategoryList.map((cat, index) => {
                            return (
                              <MenuItem key={cat._id} value={cat._id}>
                                {cat.subCat}
                              </MenuItem>
                            );
                          })}
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
                        onChange={(e) => {
                          setisFeaturedValue(e.target.value);
                          setFormFields((prev) => ({
                            ...prev,
                            isFeatured: e.target.value,
                          }));
                        }}
                        displayEmpty
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
                        onChange={(e) =>
                          setFormFields((prev) => ({
                            ...prev,
                            productWeight: e.target.value,
                          }))
                        }
                        displayEmpty
                        className="w-100"
                      >
                        {productWeightData.map((item) => (
                          <MenuItem key={item._id} value={item._id}>
                            {item.productWeight}
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
                    {existingImage.map((img) => (
                      <div key={img._id} className="uploadBox">
                        <img
                          src={img.url}
                          alt="product"
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                          }}
                        />

                        <span
                          className="remove"
                          onClick={() => handleRemoveImage(img._id)}
                        >
                          <IoCloseSharp />
                        </span>
                      </div>
                    ))}
                    {previews.map((url, i) => (
                      <div key={i} className="uploadBox">
                        <LazyLoadImage
                          alt="preview"
                          effect="blur"
                          src={url}
                          className="w-100"
                        />
                        <span
                          className="remove"
                          onClick={() => removeNewFile(i)}
                        >
                          <IoCloseSharp />
                        </span>
                      </div>
                    ))}

                    <div className="uploadBox">
                      <input
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

export default EditProduct;
