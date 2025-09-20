import React, { useState } from "react";

const ReviewPage = () => {
  // Default reviews
  const [reviews, setReviews] = useState([
    {
      name: "Arunima",
      rating: 5,
      comment: "Amazing quality! Very comfortable to wear.",
      date: "Sep 10, 2025",
    },
    {
      name: "Rahul",
      rating: 4,
      comment: "Good product, delivery was on time.",
      date: "Sep 8, 2025",
    },
    {
      name: "Sneha",
      rating: 5,
      comment: "Loved it 😍 stylish and lightweight.",
      date: "Sep 5, 2025",
    },
  ]);

  const [formData, setFormData] = useState({ text: "", rating: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.text.trim() || !formData.rating) return;

    const newReview = {
      name: "Guest User",
      rating: parseInt(formData.rating),
      comment: formData.text,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };

    setReviews([newReview, ...reviews]);
    setFormData({ text: "", rating: "" });
  };

  // Calculate average rating
  const averageRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  // Count ratings
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r) => r.rating === star).length
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Customer Reviews
        </h1>

        {/* Average Rating */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-4xl font-bold text-gray-800">
                {averageRating.toFixed(1)} ⭐
              </p>
              <p className="text-gray-500">{reviews.length} reviews</p>
            </div>

            {/* Rating distribution */}
            <div className="flex-1 ml-6">
              {ratingCounts.map((count, i) => {
                const star = 5 - i;
                const percent = (count / reviews.length) * 100 || 0;
                return (
                  <div key={star} className="flex items-center mb-1">
                    <span className="w-10 text-sm text-gray-600">
                      {star} ⭐
                    </span>
                    <div className="flex-1 bg-gray-200 h-2 rounded">
                      <div
                        className="bg-yellow-400 h-2 rounded"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-gray-600">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4">Leave a Review</h2>
          <textarea
            placeholder="Leave something..."
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={formData.rating}
            onChange={(e) =>
              setFormData({ ...formData, rating: e.target.value })
            }
            className="w-full border p-3 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Rating</option>
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 && "s"}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Post Review
          </button>
        </form>

        {/* Review List */}
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white p-5 rounded-lg shadow border border-gray-100"
            >
              <div className="flex items-center mb-2">
                {/* Avatar */}
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold mr-3">
                  {review.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>

                {/* Stars */}
                <span className="text-yellow-500 text-lg">
                  {"⭐".repeat(review.rating)}
                </span>
              </div>

              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;
