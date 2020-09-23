import React, { useEffect } from 'react'
import {useSelector} from 'react-redux'
import HomeSlider from './home-slider/home-slider';
import CardBlock from '../../../components/utils/card-block/card-block';

import {store} from "../../../redux/store";
import { getProductsByArrival,getProductsBySell} from "../../../redux/product/product-action";
import './home.scss'

const Home = () => {


     useEffect(() => {
        store.dispatch(getProductsByArrival());
        store.dispatch(getProductsBySell());
    }, []);


    const productBySell = useSelector(state => state.product.productBySell)
    const productByArrival = useSelector(state => state.product.productByArrival)

    
    // const products = useSelector(state => state.product.products)

    return (
        <div className="home_wrapper">
            <HomeSlider />
            <CardBlock 
                list={productBySell} 
                title="Best Seller"
            />
            <CardBlock 
                list={productByArrival} 
                title="New Arrival"
            />
        </div>
    )
}

export default Home
