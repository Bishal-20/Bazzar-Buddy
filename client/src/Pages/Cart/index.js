import { Link } from "react-router-dom";
import QunatityBox from "../../components/QuantityBox";
import { IoMdClose } from "react-icons/io";
import emptyCart from "../../assets/images/no-buying.gif"
import Button from "@mui/material/Button";
import { MdOutlineShoppingCartCheckout } from "react-icons/md";
import { MyContext } from "../../App";
import { useContext , useEffect, useState } from "react";
import { deleteData, editData, fetchDataFromApi } from "../../utils/api";
import Rating from "@mui/material/Rating";
const Cart=()=>{
    const [cartData , setCartData] = useState([]);
    let [cartFields , setCartFields] = useState({});
    const [productQuantity , setProductQuantity]=useState();
    const [changeQuantity , setChangeQuantity]=useState(0);
    const [isLoading , setIsloading] = useState(false);

    const context = useContext(MyContext);

    useEffect(()=>{
        fetchDataFromApi('/api/cart').then((res)=>{
            setCartData(res);
        })
    },[])
        const quantity=(val)=>{
        setProductQuantity(val);
        setChangeQuantity(val);
    }

    const selectedItem=(item , quantityVal)=>{
        if(changeQuantity !==0){
        setIsloading(true);
        const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = item?.productTitle
            cartFields.images = item?.images
            cartFields.rating = item?.rating
            cartFields.price = item?.price
            cartFields.quantity = quantityVal
            cartFields.subTotal = parseInt(item?.price) * parseInt(quantityVal)
            cartFields.productId = item?.id
            cartFields.userId = user?.id

            editData(`/api/cart/${item._id}`, cartFields).then((res)=>{
                setTimeout(()=>{
                    setIsloading(false);
                    fetchDataFromApi('/api/cart').then((res)=>{
                        setCartData(res);
                    })
                },1000);
            })
        }
    }

    const removeItem=(id)=>{
        deleteData(`/api/cart/${id}`).then((res)=>{
            context.setAlertBox({
                open:true,
                error:false,
                msg:"Item removed from cart!"
            })

            fetchDataFromApi('/api/cart').then((res)=>{
                setCartData(res);
            })

            context.getCartData();
        })
    }
    return(
      <>

        <section className="section cartPage">
           <div className="container">
            <h2 className="hd mb-2">YOUR CART</h2>
            {
                cartData?.length === 0 ? (

                    <div className="emptyCart text-center py-5 w-100">
                    <img
                        src={emptyCart}
                        alt="empty cart"
                        style={{ width: 250, opacity: 0.85 }}
                    />

                    <h4 className="mt-4">Your cart is empty</h4>
                    <p className="text-muted">Looks like you haven’t added anything yet.</p>

                    <Link to="/">
                        <Button className="btn-blue mt-3">Continue Shopping</Button>
                    </Link>
                    </div>

                ) : <div className="row">
                <div className="col-md-9 pr-5">
             <p>There are <b className="text-red">{cartData?.length}</b> products in your cart</p>
             <div className="table-responsive">
                <table className="table">
                    <thead>
                       <tr>
                        <th width='35%'>Product</th>
                        <th width='20%'>Unit Price</th>
                        <th width='25%'>Quantity</th>
                        <th width='10%'>Subtotal</th>
                        <th width='10%'>Remove</th>
                       </tr>
                    </thead>
                    <tbody>
                        {
                            cartData?.length > 0 ? cartData?.map((item , index) => {
                                return(
                                <tr>
                                    <td  width='35%'>
                                        <Link to={`/product/${item?.productId}`}>
                                        <div className="d-flex align-items-center cartItem">
                                            <div className="imageWrapper">
                                                <img src={item?.images} alt={item?.productTitle} className="w-100"/>
                                            </div>
                                            <div className="info px-3">
                                                <h6>{item?.productTitle?.substr(0,30) + '...'}</h6>
                                                <Rating name="raed-only" value={item?.rating} readOnly size="small" />
                                            </div>
                                        </div>
                                        
                                        </Link>
                                        
                                    </td>
                                    <td width='15%'>Rs {item?.price}</td>
                                    <td width='25%'><QunatityBox quantity={quantity} item={item} selectedItem={selectedItem} value={item?.quantity}/></td>
                                    <td width='15%'>Rs {item?.subTotal}</td>
                                    <td width='10%'><span className="remove" onClick={()=>removeItem(item?._id)}><IoMdClose /></span></td>
                                </tr>
                                )
                            }) : null
                        }
                    </tbody>
                </table>
             </div>
            </div>
                <div className="col-md-3">
                    <div className="card border p-3 cartDetails">
                       <h4>CART TOTALS</h4>

                       <div className="d-flex align-items-center mt-3">
                         <span>Subtotal</span>
                         <span className="ml-auto text-red font-weight-bold">
                            &#8377;
                            {
                                cartData?.length !== 0 && cartData.map(item => parseInt(item.price)*item.quantity).reduce((total , value)=>total + value , 0)
                            }
                         </span>
                       </div>
                       <div className="d-flex align-items-center mt-3">
                         <span>Shipping</span>
                         <span className="ml-auto"><b>Free</b></span>
                       </div>
                       <div className="d-flex align-items-center mt-3">
                         <span>Estimate For</span>
                         <span className="ml-auto"><b>India</b></span>
                       </div>
                       <div className="d-flex align-items-center mt-3">
                         <span>Total</span>
                         <span className="ml-auto text-red font-weight-bold">
                            &#8377;
                            {
                                cartData?.length !== 0 && cartData.map(item => parseInt(item.price)*item.quantity).reduce((total , value)=>total + value , 0)
                            }
                         </span>
                       </div>
                        < br />
                        <Link to='/checkout'>
                       <Button className='btn-blue btn-lg btn-big bg-red ml-3'><MdOutlineShoppingCartCheckout /> &nbsp;Proceed to Checkout</Button>
                       </Link>
                    </div>
                </div>
             </div>
            } 
           </div>
        </section>
        {
            isLoading===true &&
            <div className="loading"></div>
        }
      </>
    )
}

export default Cart;