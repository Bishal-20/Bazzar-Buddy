import { LuMilk } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiDiscountPercentLine } from "react-icons/ri";
import { AiOutlineDollarCircle } from "react-icons/ai";
import { FaSquareInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { Link } from "react-router-dom";
const Footer = () => {
   return(
     <footer>
        <div className="container">
            <div className="topInfo row">
                <div className="col d-flex align-items-center">
                    <span><LuMilk /></span>
                    <span className="ml-2">Everyday fresh products</span>
                </div>
                <div className="col d-flex align-items-center">
                    <span><TbTruckDelivery /></span>
                    <span className="ml-2">Free delivery for order over $70</span>
                </div>
                <div className="col d-flex align-items-center">
                    <span><RiDiscountPercentLine /></span>
                    <span className="ml-2">Daily Mega Discounts</span>
                </div>
                <div className="col d-flex align-items-center">
                    <span><AiOutlineDollarCircle /></span>
                    <span className="ml-2">Best price on the market</span>
                </div>
            </div>

            <div className="row mt-5 linkWrap">
              <div className="col">
                <h5>FRUIT & VEGETABLES</h5>
                <ul>
                    <li><Link to='#'>Fresh Vegetables</Link></li>
                    <li><Link to='#'>Herbs & Seasonings</Link></li>
                    <li><Link to='#'>Fresh Fruits</Link></li>
                    <li><Link to='#'>Cuts & Sprouts</Link></li>
                    <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                    <li><Link to='#'>Packaged Produce</Link></li>
                    <li><Link to='#'>Party Trays</Link></li>
                </ul>
              </div>
              <div className="col">
                <h5>Dairy</h5>
                <ul>
                    <li><Link to='#'>Fresh Vegetables</Link></li>
                    <li><Link to='#'>Herbs & Seasonings</Link></li>
                    <li><Link to='#'>Fresh Fruits</Link></li>
                    <li><Link to='#'>Cuts & Sprouts</Link></li>
                    <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                    <li><Link to='#'>Packaged Produce</Link></li>
                    <li><Link to='#'>Party Trays</Link></li>
                </ul>
              </div>
              <div className="col">
                <h5>Meat</h5>
                <ul>
                    <li><Link to='#'>Fresh Vegetables</Link></li>
                    <li><Link to='#'>Herbs & Seasonings</Link></li>
                    <li><Link to='#'>Fresh Fruits</Link></li>
                    <li><Link to='#'>Cuts & Sprouts</Link></li>
                    <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                    <li><Link to='#'>Packaged Produce</Link></li>
                    <li><Link to='#'>Party Trays</Link></li>
                </ul>
              </div>
              <div className="col">
                <h5>Beverages</h5>
                <ul>
                    <li><Link to='#'>Fresh Vegetables</Link></li>
                    <li><Link to='#'>Herbs & Seasonings</Link></li>
                    <li><Link to='#'>Fresh Fruits</Link></li>
                    <li><Link to='#'>Cuts & Sprouts</Link></li>
                    <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                    <li><Link to='#'>Packaged Produce</Link></li>
                    <li><Link to='#'>Party Trays</Link></li>
                </ul>
              </div>
              <div className="col">
                <h5>Breads & Bakery</h5>
                <ul>
                    <li><Link to='#'>Fresh Vegetables</Link></li>
                    <li><Link to='#'>Herbs & Seasonings</Link></li>
                    <li><Link to='#'>Fresh Fruits</Link></li>
                    <li><Link to='#'>Cuts & Sprouts</Link></li>
                    <li><Link to='#'>Exotic Fruits & Veggies</Link></li>
                    <li><Link to='#'>Packaged Produce</Link></li>
                    <li><Link to='#'>Party Trays</Link></li>
                </ul>
              </div>
            </div>

            <div className="copyright mt-3 pt-3 pb-3 d-flex">
                <p className="mb-0">Copyright 2025 © Bishal Barman. All rights reserved.</p>
                <ul className="list list-inline ml-auto mb-0">
                    <li className="list-inline-item">
                        <Link to='#'><FaFacebook /></Link>
                    </li>
                     <li className="list-inline-item">
                        <Link to='#'><FaSquareInstagram /></Link>
                    </li>
                     <li className="list-inline-item">
                        <Link to='#'><FaSquareXTwitter /></Link>
                    </li>
                </ul>
            </div>
        </div>
     </footer>
   )


}

export default Footer;