import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import React, { useContext , useEffect , useRef } from 'react';
import { MyContext } from '../../App';
import { fetchDataFromApi } from '../../utils/api';

const Sidebar=(props)=>{
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [brands, setBrands] = useState([]);
    const [selectedBrand, setSelectedBrand] = useState('');
    const context = useContext(MyContext);

    const priceTimer = useRef(null);

    
     const [filterCat, setFilterCat] = React.useState('');

    const handleChange = (event) => {
    setFilterCat(event.target.value);
    props.filter(event.target.value);
    };


    const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrand(brand);

    if (props.filterByBrand) {
        props.filterByBrand(brand);
    }
    };

    useEffect(() => {
    fetchDataFromApi('/api/product?perPage=1000')
      .then(res => {
        if (!res?.productList) return;

        const uniqueBrands = [...new Set(res.productList.map(p => p.brand))].map(brand => ({
          name: brand
        }));
        setBrands(uniqueBrands);
      })
      .catch(err => console.error('Failed to fetch products for brands:', err));
  }, []);

    useEffect(() => {
    if (!props.filterByPrice) return;

    if (priceTimer.current) {
        clearTimeout(priceTimer.current);
    }

    priceTimer.current = setTimeout(() => {
        props.filterByPrice(priceRange[0], priceRange[1]);
    }, 400);

    return () => clearTimeout(priceTimer.current);
    }, [priceRange]);


    return(
       <>
       
         <div className="sidebar">

            <div className="filterBox">
                <h6>PRODUCT CATEGORIES</h6>
                <div className='scroll'>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={filterCat}
                        onChange={handleChange}
                    >
                        {
                        context.categoryData?.map((cat)=>(
                            <FormControlLabel value={cat.id} control={<Radio />} label={cat.name} />
                        ))}
                    </RadioGroup> 
                </div>
            </div>

            <div className="filterBox">
              <h6>FILTER BY PRICE</h6>
              <RangeSlider
                value={priceRange}
                onInput={setPriceRange}
                min={0}
                max={5000}
                step={5}
                />
              <div className='d-flex pt-2 pb-2 priceRange'>
                <span>From: <strong className='text-dark'>Rs: {priceRange[0]}</strong></span>
                <span className='ml-auto'>From: <strong className='text-dark'>Rs:
                {priceRange[1]}</strong></span>
            </div>
            </div>

            <div className="filterBox">
                <h6>BRANDS</h6>
                <div className='scroll'>
                    <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={selectedBrand}
                        onChange={handleBrandChange}
                    >
                        {
                        brands?.map((brand, index)=>(
                                <FormControlLabel key={index} value={brand.name} label={brand.name} control={<Radio />}  className='w-100'  />
                        ))
                        }
                    </RadioGroup>
                </div>
            </div>

            <br />

            <Link to='#'><img src='https://cdn.dribbble.com/users/12601/screenshots/3554804/gif.gif'style={{width: '230px' , height:'290'}}/></Link>
         </div>
       </>
    )
}

export default Sidebar;