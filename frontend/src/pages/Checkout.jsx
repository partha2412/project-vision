
const Checkout = () => {
    return (
        <div>
            <div className="bg-gray-900 w-screen h-screen flex justify-center items-center">
                <div className="w-400 h-200 flex flex-row bg-amber-200">
                    {/* Left */}
                    <div className="flex-1 hover:flex-2 bg-blue-500 h-full duration-300">
                        <div className="group flex flex-col justify-center items-center w-full h-full ">
                            {/* Delivery */}
                            <div className="flex flex-col p-2 border gap-5 w-80 duration-300 group-hover:w-140">
                                <div>
                                    <h1>Delivery</h1>
                                    <div className="grid grid-cols-2 gap-5">
                                        <input className="border p-2 " type="text" placeholder="First name" />
                                        <input className="border p-2 " type="text" placeholder="Last name" />
                                    </div>
                                    <div className="">
                                        <input className="border p-2 w-full" type="text" placeholder="Address" />
                                    </div>
                                    <div className="">
                                        <input className="border p-2 w-full" type="text" placeholder="Apartment, suite, etc. (optional)" />
                                    </div>
                                    <div className="flex gap-5">
                                        <input className="border p-2 w-full" type="text" placeholder="City" />
                                        <input className="border p-2 w-full" type="text" placeholder="PIN code" />
                                    </div>
                                    <div>
                                        <input className="border p-2 w-full" type="text" placeholder="Phone" />
                                    </div>
                                </div>

                                {/* Payment */}
                                <div className="border w-full h-full bg-amber-600">
                                    <h1>Paymeny</h1>
                                    <div>
                                        <div class="form-check">
                                            <label class="form-check-label">
                                            <input type="radio" class="form-check-input " name="" id="" value="checkedValue" checked />
                                            Razorpay Secure (UPI, Cards, Wallets, NetBanking)
                                          </label>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    <div className="flex-1 hover:flex-2 bg-sky-400 h-full duration-300" ></div>
                </div>
            </div>
        </div>
    )
}

export default Checkout
