import React from 'react'
import Carousel from '../components/Carousl'

const Test = () => {

    const images = [
        "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?cs=srgb&dl=pexels-souvenirpixels-414612.jpg&fm=jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmHyWSsdG951m8fwC__xXpFsJTOmo5WxpaSA23FBEFN5lOxnkTpja5aG7oOx2l9GoZNgI&usqp=CAU",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8koDHsMO-maIL6s9qn4iaBZxh_Kb9SJTK8QXqFqFGZB9V4PH2AfINA1FX4o7mqToYbls&usqp=CAU",
    ]
  return (
    <div className='w-screen h-screen'>
      <Carousel images={images}/>
    </div>
  )
}

export default Test
