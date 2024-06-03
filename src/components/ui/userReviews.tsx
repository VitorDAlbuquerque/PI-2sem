import React from "react";
import homelander from "../assets/homelander-1-1.jpg";

interface Review {
  user: string;
  rating: number;
  comment: string;
  userPhoto?: string; 
}

interface UserReviewsProps {
  reviews: Review[];
}

function UserReviews({ reviews }: UserReviewsProps) {
  return (
    <div className="m-10 p-8 font-montserrat">
      <h2 className="text-2xl font-semibold mb-4 text-center text-lightGreen">Avaliações dos Usuários</h2>
      {reviews.length === 0 ? (
        <p className="text-gray-500 text-center">Ainda não há avaliações. Assista e seja o primeiro a avaliar!</p>
      ) : (
        reviews.map((review, index) => (
          <div key={index} className="mb-6 border border-gray-300 rounded-lg p-4">
            <div className="flex items-center mb-4">
              <img
                src="homelander"
              />
              <div>
                <p className="text-gray-800 font-semibold">{review.user}</p>
                <p className="text-gray-500">{review.rating}/10</p>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default UserReviews;
