import Carousel from '../components/Carousl'
import BuyOneGetOne from './slides/BuyOneGetOne'
import Slide2 from './slides/Slide2'
import CategorySection from "./slides/CategorySection";
import SubNavBar from '../common/SubNavBar';

const Landing = () => {
    const images = [
        
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-harrypotter_20052025_rat.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-celebs-style-260625.png",
    ]
    return (
        <div>
            <SubNavBar/>
            <div className='flex flex-col h-full'>


                {/* Sliding 1st Slide */}
                <div className='bg-sky-400'>
                    <Carousel images={images} />
                </div>

                {/* Next Slide */}
                <div className='h-full'>
                    <Slide2/>
                </div>
                {/* Men / Women / Kids Section */}
                 <div>
                   <CategorySection />
                </div>

                <div>
                    <BuyOneGetOne/>
                </div>


            </div>
        </div>
    )
}

export default Landing
