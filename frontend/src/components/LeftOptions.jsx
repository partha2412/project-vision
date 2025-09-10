import React, { useState } from 'react'

const LeftOptions = () => {
    const [selected, setSelected] = useState("Trending");

    const options = [
        "Trending",
        "Best Rating",
        "Best Seller",
        "Discount",
        "High to Low",
        "Low to High",
    ];

    const [value, setValue] = useState(50);



    return (
        <div className='w-100'>
            {/* All Options */}
            <div className='h-full w-full bg-amber-300 pt-4'>
                <div className='flex flex-col justify-center'>
                    {/* Sorting */}
                    <div>
                        <h1>Sort Products</h1>
                        <div className="flex flex-col gap-2 p-4">
                            {options.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name="sortOption"
                                        value={option}
                                        checked={selected === option}
                                        onChange={() => setSelected(option)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}

                            {/* <p className="mt-0 text-sm text-gray-500">
                            Selected: <span className="font-medium">{selected}</span>
                        </p> */}
                        </div>
                    </div>

                    {/* Range */}
                    <div>
                        <div className="flex flex-col items-center justify-center bg-gray-100">
                            <label className="mb-4 text-lg font-semibold text-gray-700">
                                Value: {value}
                            </label>

                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                className=" accent-blue-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeftOptions
