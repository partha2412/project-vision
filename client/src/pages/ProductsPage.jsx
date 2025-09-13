import { useParams } from "react-router-dom";
import Products from './Products'
import LeftOptions from '../components/LeftOptions'
import { datasets } from "../datas/productsData";


const ProductsPage = () => {
    const { type } = useParams(); // 👈 get the value from URL

    // Pick dataset based on type
    const dataset = datasets[type]
    
    return (
        <div className='flex'>
            <LeftOptions />
            <Products data={dataset} />
        </div>
    )
}

export default ProductsPage
