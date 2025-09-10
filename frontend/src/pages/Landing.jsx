import Carousel from '../components/Carousl'
import Slide2 from './Slide2'

const Landing = () => {
    const images = [
        
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-harrypotter_20052025_rat.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-hustlr.png",
        "https://static5.lenskart.com/media/uploads/Desktop-v2-topbanner-celebs-style-260625.png",
    ]
    return (
        <div>
            <div className='flex flex-col h-screen'>


<<<<<<< HEAD
=======
               {/* <Navbar/> */}
>>>>>>> e0948946888a7df33599e9f16f3df43edac58a4d
                {/* Sliding 1st Slide */}
                <div className='bg-sky-400 h-180'>
                    <Carousel images={images} />
                </div>
<<<<<<< HEAD

                {/* Next Slide */}
                <div className='h-full'>
                    <Slide2/>
                </div>


=======
                 <Middlebar/>
                 <BuyOneGetOne/>
                 <LowerNavbar/>
                
>>>>>>> e0948946888a7df33599e9f16f3df43edac58a4d
            </div>
        </div>
    )
}

export default Landing
