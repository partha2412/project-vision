import { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// ─── Star renderer ────────────────────────────────────────────────────────────
const Stars = ({ rating, size = "text-xs" }) =>
  Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating))
      return <FaStar key={i} className={`text-amber-400 ${size}`} />;
    if (i < rating)
      return <FaStarHalfAlt key={i} className={`text-amber-400 ${size}`} />;
    return <FaRegStar key={i} className={`text-gray-200 ${size}`} />;
  });

// ─── Interactive star picker ──────────────────────────────────────────────────
const StarPicker = ({ value, onChange }) => {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(star)}
          className="transition-transform hover:scale-110"
        >
          <FaStar
            className={`text-xl transition-colors duration-150 ${
              star <= (hovered || value) ? "text-amber-400" : "text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
// Props:
//   reviews  — array from product.reviews (DB shape: { user, rating, comment, createdAt })
//   onSubmit — async (rating, comment) => void  (call your API here from parent)
const ReviewPage = ({ reviews = [], onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Derived stats
  const total = reviews.length;
  const avg = total > 0
    ? reviews.reduce((a, r) => a + r.rating, 0) / total
    : 0;

  const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
    pct: total > 0
      ? (reviews.filter((r) => r.rating === star).length / total) * 100
      : 0,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) return setError("Please select a rating.");
    if (!comment.trim()) return setError("Please write a comment.");
    setError("");
    setSubmitting(true);
    try {
      if (onSubmit) await onSubmit(rating, comment);
      setComment("");
      setRating(0);
    } catch {
      setError("Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitial = (user) => {
    if (!user) return "?";
    if (typeof user === "string") return user[0]?.toUpperCase() || "?";
    return (
      user.firstname?.[0]?.toUpperCase() ||
      user.email?.[0]?.toUpperCase() ||
      "?"
    );
  };

  const getName = (user) => {
    if (!user) return "Anonymous";
    if (typeof user === "string") return "User";
    if (user.firstname || user.lastname)
      return `${user.firstname || ""} ${user.lastname || ""}`.trim();
    return user.email || "User";
  };

  return (
    <div className="w-full space-y-10">
      {/* Section header */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
        {total > 0 && (
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
            {total} review{total !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {total > 0 ? (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-14 items-start">
          {/* Average score */}
          <div className="flex-shrink-0 text-center sm:text-left">
            <p className="text-6xl font-bold text-gray-900 leading-none">
              {avg.toFixed(1)}
            </p>
            <div className="flex gap-0.5 mt-2 justify-center sm:justify-start">
              <Stars rating={avg} size="text-sm" />
            </div>
            <p className="text-xs text-gray-400 mt-1">out of 5</p>
          </div>

          {/* Distribution bars */}
          <div className="flex-1 w-full space-y-2">
            {ratingCounts.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-xs text-gray-400 w-4 text-right flex-shrink-0">
                  {star}
                </span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-4 flex-shrink-0">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-400">
          No reviews yet. Be the first to review!
        </p>
      )}

      <div className="h-px bg-gray-100" />

      {/* Write a review */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-5">
          Write a Review
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Star picker */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Your Rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product…"
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none transition"
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              submitting
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {submitting ? "Posting…" : "Post Review"}
          </button>
        </form>
      </div>

      {/* Review list */}
      {total > 0 && (
        <>
          <div className="h-px bg-gray-100" />
          <div className="space-y-6">
            {reviews.map((review, i) => (
              <div key={review._id || i} className="flex gap-4">
                {/* Avatar */}
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500">
                  {getInitial(review.user)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-800">
                      {getName(review.user)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>

                  <div className="flex gap-0.5">
                    <Stars rating={review.rating} />
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewPage;