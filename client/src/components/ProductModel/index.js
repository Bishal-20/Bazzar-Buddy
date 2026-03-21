import Dialog from '@mui/material/Dialog';
import Button from "@mui/material/Button";
import { IoMdClose } from "react-icons/io";
import Rating from '@mui/material/Rating';
import QunatityBox from '../QuantityBox';
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { MdOutlineCompareArrows } from "react-icons/md";
import ProductZoom from '../ProductZoom';
import { useContext , useEffect, useState } from 'react';
import { MdLocalGroceryStore } from "react-icons/md";
import { MyContext } from '../../App';
import { postData , fetchDataFromApi } from '../../utils/api';

const ProductModel=(props)=>{
      const [activeWeight , setActiveWeight]=useState(null);
      const [isAddedtoWhislist , setIsAddedtoWhislist] = useState(false);
      const [productData , setproductData]=useState(null);
      const [tabError , setTabError]=useState(false);
      let [cartFields , setCartFields] = useState({});
      const [productQuantity , setProductQuantity]=useState();
        const context = useContext(MyContext);

      const isActive=(index)=>{
        setActiveWeight(index);
        setTabError(false);
      }
      const quantity=(val)=>{
        setProductQuantity(val);
      }
      const addtoCart=()=>{
        if(activeWeight !== null){

            const user = JSON.parse(localStorage.getItem("user"));
            cartFields.productTitle = props?.data?.name
            cartFields.images = props?.data?.images?.images?.[0]?.url
            cartFields.rating = props?.data?.rating
            cartFields.price = props?.data?.price
            cartFields.quantity = productQuantity
            cartFields.subTotal = parseInt(props?.data?.price) * parseInt(productQuantity)
            cartFields.productId = props?.data?.id
            cartFields.userId = user?.id

        
            context.addToCart(cartFields);
        }else{
            setTabError(true);
        }

    }
  const addToWhislist = async (id) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if(user!==undefined && user!==null && user!==""){

      const data = {
        productTitle: props?.data?.name,
        images: props?.data?.images?.images?.[0]?.url,
        rating: props?.data?.rating,
        price: props?.data?.price,
        productId: props?.data?.id,
        userId: user.id
      };

      await postData(`/api/wishlist/add/`, data);

      context.setAlertBox({
        open: true,
        error: false,
        msg: "Product added to Wishlist"
      });
      setIsAddedtoWhislist(true);
      }else{
        context.setAlertBox({
        open: true,
        error: true,
        msg: "Please login to Continue"
      });
      }


    } catch (err) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: err?.response?.data?.msg || "Already in Wishlist"
      });
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    fetchDataFromApi(
      `/api/wishlist?productId=${props?.data?.id}&userId=${user?.id}`
    ).then((res) => {
      setIsAddedtoWhislist(res.length !== 0);
    });

  }, [props?.data?.id]);

    const selectedItem=()=>{

    }
    return(
       <>
        <Dialog  open={context.isOpenProductModel} onClose={()=>context.setisOpenProductModel(false)} className='productModel'>
          <Button className="close_" onClick={()=>context.setisOpenProductModel(false)}><IoMdClose /></Button>
          <h4 className='mb-1 font-weight-bold pr-5'>{props?.data?.name}</h4>
          <div className='d-flex align-items-center'>
            <div className='d-flex align-items-center mr-4'>
              <span>Brand:</span>
              <span className='ml-2'>{props?.data?.brand}</span>
            </div>
            <Rating className='mt-2 mb-2' name="read-only" value={props?.data?.rating || 0} readOnly size="small" precision={0.5}/>
          </div>
           <hr />
        <div className='row mt-2 productDetailModal'>
          <div className='col-md-5'>
             <ProductZoom data={props.data}   discount={props?.data?.discount}/>
            </div>
            <div className='col-md-7'>
              <div className='d-flex info align-items-center mb-3'>
                <span className='oldPrice lg mr-2'>Rs {props?.data?.oldPrice}</span>
                <span className='newPrice text-danger lg'>Rs {props?.data?.price}</span>
              </div>
              <span className='badge bg-success'>In Stock</span>

              <p className='mt-2'>{props?.data?.description}</p>

              <div className='productSize d-flex align-items-center'>
                <span>Weight:</span>
                <ul className={`list list-inline mb-0 pl-4 ${tabError===true && 'error'}`}>
                    {
                        props?.data?.productWeight?.map((item , index)=>(
                            <li className='list-inline-item' key={item._id}>
                            <a
                            href="#"
                            className={`tag ${activeWeight === index ? 'active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                isActive(index);
                            }}
                            >
                            {item.productWeight}
                            </a>
                        </li>
                        ))
                    }
                </ul>
              </div>

              <div className='d-flex align-items-center'>
                <QunatityBox quantity={quantity} selectedItem={selectedItem}/>
                <Button className='btn-blue btn-lg btn-big btn-round ml-3' onClick={()=>addtoCart()}><MdLocalGroceryStore /> &nbsp; {
                  context.addingInCart===true ?"adding..." : "Add to Cart"
                }</Button>
              </div>

              <div className='d-flex align-items-center mt-5 actions'>
                <Button className='btn-round btn-sml ' variant='outlined' onClick={()=>addToWhislist(props.item?.id)}> 
                  {
                    isAddedtoWhislist===true ? 
                    <><FaHeart className='text-danger'/> &nbsp; Added To Wishlist</> :
                    <><CiHeart/> &nbsp; Add To Wishlist</>
                  }
                </Button>
                <Button className='btn-round btn-sml ml-3' variant='outlined'> <MdOutlineCompareArrows /> &nbsp; Compare</Button>
              </div>
            </div>
            </div>
            

        </Dialog>      
       </>
    )
}

export default ProductModel;