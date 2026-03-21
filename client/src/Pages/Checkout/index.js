import React, { useContext, useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { fetchDataFromApi, postData , deleteData } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../../App";

const Checkout = () => {
  const [cartData, setCartData] = useState([]);
  const [formFields, setFormFields] = useState({
    fullName: "",
    country: "",
    streetadressLine1: "",
    streetadressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    email: "",
  });

  useEffect(() => {
    fetchDataFromApi("/api/cart").then((res) => {
      setCartData(res);
    });
  }, []);

  const onChangeInput = (e) => {
    setFormFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const context = useContext(MyContext);
  const history = useNavigate();

  const checkout = (e) => {
    e.preventDefault();

    if (
      formFields.fullName === "" ||
      formFields.country === "" ||
      formFields.streetadressLine1 === "" ||
      formFields.streetadressLine2 === "" ||
      formFields.city === "" ||
      formFields.state === "" ||
      formFields.zipCode === "" ||
      formFields.phoneNumber === "" ||
      formFields.email === ""
    ) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Required fields are missing",
      });
      return false;
    }
    var pay = new window.Razorpay(options);
    pay.open();
  };

  const addressInfo = {
    name: formFields.fullName,
    phoneNumber: formFields.phoneNumber,
    address: formFields.streetadressLine1 + formFields.streetadressLine2,
    pincode: formFields.zipCode,
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
  };

  const amountValue = cartData?.length
    ? cartData
        .map((item) => parseInt(item.price) * item.quantity)
        .reduce((total, value) => total + value, 0)
    : 0;

  var options = {
    key: process.env.REACT_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.REACT_APP_RAZORPAY_KEY_SECRET,
    // Enter the Key ID generated from the Dashboard
    amount: parseInt(amountValue) * 100, // Amount is in currency subunits.
    currency: "INR",
    name: "Bazzar Buddy", //your business name
    description: "Test Transaction",
    handler: function (response) {
      const paymentId = response.razorpay_payment_id;
      const user = JSON.parse(localStorage.getItem("user"));
      const payload = {
        name: addressInfo.name,
        phoneNumber: formFields.phoneNumber,
        address: addressInfo.address,
        pincode: addressInfo.pincode,
        amount: parseInt(amountValue) * 100,
        paymentId: paymentId,
        email: user?.email,
        userId: user?.id,
        products: cartData,
      };

      postData("/api/orders/create", payload).then(async(res) => {
        await deleteData(`/api/cart/clear/${user?.id}`);
        context.setCartData([]);
        setCartData([]);
        history("/orders");
      });
    },
    theme: {
      color: "#3399cc",
    },
  };

  return (
    <section className="section">
      <div className="container">
        <form className="checkout-form" onSubmit={checkout}>
          <div className="row">
            <div className="col-md-8">
              <h2 className="hd">BILLING DETAILS</h2>
              <div className="row mt-3">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Full Name *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="fullName"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Country *"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="country"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
              <h6>Street Address*</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="House Number and Street name"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetadressLine1"
                      onChange={onChangeInput}
                    />
                  </div>

                  <div className="form-group">
                    <TextField
                      label="Apartment , suite , unit etc.(optional)"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="streetadressLine2"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Town/City*</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="State"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="city"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
              <h6>State/Region*</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="State"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="state"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>

              <h6>Postal Code/Pin*</h6>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group">
                    <TextField
                      label="ZIP Code"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="zipCode"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Phone Number*"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="phoneNumber"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <TextField
                      label="Email Address*"
                      variant="outlined"
                      className="w-100"
                      size="small"
                      name="email"
                      onChange={onChangeInput}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card order-info">
                <h4 className="hd">YOUR ORDER</h4>
                <div className="table-responsive mt-3">
                  <table className="table table-borderless">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>SubTotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartData?.length > 0
                        ? cartData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td>
                                  {item?.productTitle?.substr(0, 20) + "..."}
                                  <b> x{item?.quantity}</b>
                                </td>
                                <td> &#8377; {item?.subTotal}</td>
                              </tr>
                            );
                          })
                        : null}
                      <tr className="subtotal">
                        <td>SubTotal</td>
                        <td>
                          <span className="ml-auto text-red font-weight-bold">
                            &#8377; &nbsp;
                            {cartData?.length !== 0 &&
                              cartData
                                .map(
                                  (item) =>
                                    parseInt(item.price) * item.quantity,
                                )
                                .reduce((total, value) => total + value, 0)}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <Button
                  type="submit"
                  className="btn-blue btn-lg btn-big bg-red ml-3"
                >
                  <MdOutlineShoppingCartCheckout /> &nbsp;Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Checkout;
