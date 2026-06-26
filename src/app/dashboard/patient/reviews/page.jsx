"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  getPatientReviews,
  addReview,
  updateReview,
  deleteReview,
} from "@/lib/api/reviews";
import { getPatientAppointments } from "@/lib/api/appointments";
import toast from "react-hot-toast";

// Star Rating Input
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-2xl transition-colors"
        >
          <span className={(hover || value) >= star ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

// Star Display
function StarDisplay({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={rating >= star ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

// Add/Edit Modal
function ReviewModal({ review, doctors, patientId, onClose, onSuccess }) {
  const isEdit = !!review;
  const [doctorId, setDoctorId] = useState(review?.doctorId || "");
  const [rating, setRating] = useState(review?.rating || 5);
  const [reviewText, setReviewText] = useState(review?.reviewText || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }
    setLoading(true);
    try {
      if (isEdit) {
        await updateReview(review._id, rating, reviewText);
        onSuccess("update", review._id, { rating, reviewText });
        toast.success("Review updated!");
      } else {
        const result = await addReview({ patientId, doctorId, rating, reviewText });
        onSuccess("add", result.insertedId, { patientId, doctorId, rating, reviewText });
        toast.success("Review added!");
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          {isEdit ? "Edit Review" : "Add Review"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isEdit && (
            <div>
              <label className="text-sm text-gray-600">Select Doctor</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                required
                className="w-full border rounded-lg p-2 mt-1 bg-white"
              >
                <option value="">Choose a doctor</option>
                {doctors.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.doctorName} — {d.specialization}
                  </option>
                ))}
              </select>
            </div>
          )}

          {isEdit && (
            <p className="text-sm text-gray-500">
              Doctor: {review.doctorInfo?.doctorName || "Doctor"}
            </p>
          )}

          <div>
            <label className="text-sm text-gray-600 block mb-1">Rating</label>
            <StarInput value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-sm text-gray-600">Your Review</label>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={4}
              placeholder="Share your experience..."
              required
              className="w-full border rounded-lg p-2 mt-1 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-600 rounded-xl py-2 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-700 text-white rounded-xl py-2 text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : isEdit ? "Update" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  const { data: session } = authClient.useSession();
  const [reviews, setReviews] = useState([]);
  const [visitedDoctors, setVisitedDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;

    const patientId = session.user.id;

    Promise.all([
      getPatientReviews(patientId),
      getPatientAppointments(patientId),
    ])
      .then(([reviewsData, appointmentsData]) => {
        setReviews(reviewsData);
        console.log("Appointments:", appointmentsData); 

        // Completed appointments theke unique doctors ber koro
        const uniqueDoctors = [];
        const seen = new Set();
        appointmentsData
          .forEach((a) => {
            if (a.doctorInfo && !seen.has(a.doctorId)) {
              seen.add(a.doctorId);
              uniqueDoctors.push({
                _id: a.doctorId,
                doctorName: a.doctorInfo.doctorName,
                specialization: a.doctorInfo.specialization,
              });
            }
          });
        setVisitedDoctors(uniqueDoctors);
      })
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
      toast.success("Review deleted!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleModalSuccess = (type, id, data) => {
    if (type === "update") {
      setReviews((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, rating: data.rating, reviewText: data.reviewText } : r
        )
      );
    } else {
      // Add hole refetch koro
      getPatientReviews(session.user.id).then(setReviews);
    }
  };

  if (loading)
    return <p className="text-center py-20 text-gray-500">Loading reviews...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Reviews</h1>
          <p className="text-gray-500 mt-1">{reviews.length} reviews given</p>
        </div>
        <button
          onClick={() => {
            setEditTarget(null);
            setShowModal(true);
          }}
          className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-800"
        >
          + Add Review
        </button>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-5xl mb-4">⭐</p>
          <p className="text-lg font-medium">No reviews yet</p>
          <p className="text-sm mt-1">
            Complete an appointment and share your experience
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-2xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">
                    {review.doctorInfo?.doctorName || "Doctor"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {review.doctorInfo?.specialization || ""}
                  </p>
                  <StarDisplay rating={review.rating} />
                  <p className="text-gray-600 mt-2 text-sm">
                    {review.reviewText}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => {
                      setEditTarget(review);
                      setShowModal(true);
                    }}
                    className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs rounded-lg hover:bg-blue-200 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(review._id)}
                    className="px-3 py-1.5 bg-red-100 text-red-700 text-xs rounded-lg hover:bg-red-200 font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ReviewModal
          review={editTarget}
          doctors={visitedDoctors}
          patientId={session?.user?.id}
          onClose={() => {
            setShowModal(false);
            setEditTarget(null);
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
}