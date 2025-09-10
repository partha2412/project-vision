import Carousel from '../components/Carousl'
import BuyOneGetOne from './slides/BuyOneGetOne'
import Slide2 from './slides/Slide2'

const Landing = () => {
    const images = [
        
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-harrypotter_20052025_rat.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-celebs-style-260625.png",
    ]
    return (
        <div>
            <div className='flex flex-col h-full'>


                {/* Sliding 1st Slide */}
                <div className='bg-sky-400 h-180'>
                    <Carousel images={images} />
                </div>

                {/* Next Slide */}
                <div className='h-full'>
                    <Slide2/>
                </div>

                <div>
                    <BuyOneGetOne/>
                </div>


            </div>
        </div>
    )
}

export default Landing
