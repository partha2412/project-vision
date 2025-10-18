import React from "react";
import { FaStar } from "react-icons/fa";

const mockReviews = [
  { id: 1, product: "Stylish Sunglasses", rating: 4, comment: "Loved it!" },
];

const ReviewsTab = () => {
  return mockReviews.length === 0 ? (
    <p className="text-gray-500 dark:text-gray-300">No reviews yet.</p>
  ) : (
    <div className="space-y-4">
      {mockReviews.map((rev) => (
        <div key={rev.id} className="border p-4 rounded shadow dark:border-gray-600 dark:text-white">
          <p className="font-medium">{rev.product}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: rev.rating }).map((_, i) => <FaStar key={i} className="text-yellow-500" />)}
          </div>
          <p>{rev.comment}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewsTab;
