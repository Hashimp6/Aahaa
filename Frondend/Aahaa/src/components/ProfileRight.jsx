import React from "react";
import { Star, MessageCircle } from "lucide-react";

const RightSideComponent = () => {
  const stories = [
    {
      id: 1,
      username: "Dom_Hill",
      image: "../../public/puffs.png",
      title: "Adventure Time",
    },
    {
      id: 2,
      username: "John_Kelson",
      image: "../../public/puffs.png",
      title: "Road Trip",
    },
    {
      id: 3,
      username: "Sarah_Wave",
      image: "../../public/puffs.png",
      title: "Beach Day",
    },
    {
      id: 4,
      username: "Mike_Adventure",
      image: "../../public/puffs.png",
      title: "Mountain View",
    },
    {
      id: 5,
      username: "Travel_Pro",
      image: "../../public/puffs.png",
      title: "City Lights",
    },
    {
      id: 1,
      username: "Dom_Hill",
      image: "../../public/puffs.png",
      title: "Adventure Time",
    },
    {
      id: 2,
      username: "John_Kelson",
      image: "../../public/puffs.png",
      title: "Road Trip",
    },
    {
      id: 3,
      username: "Sarah_Wave",
      image: "../../public/puffs.png",
      title: "Beach Day",
    },
    {
      id: 4,
      username: "Mike_Adventure",
      image: "../../public/puffs.png",
      title: "Mountain View",
    },
    {
      id: 5,
      username: "Travel_Pro",
      image: "../../public/puffs.png",
      title: "City Lights",
    },
  ];

  const posts = [
    {
      id: 1,
      image: "../../public/puffs.png",
      description: "Amazing sunset view from the mountain top!",
      rating: 4.5,
      username: "John_Kelson",
      comments: 38,
    },
    {
      id: 2,
      image: "../../public/puffs.png",
      description: "Perfect weekend getaway at the beach",
      rating: 5,
      username: "Dom_Hill",
      comments: 45,
    },
    {
      id: 3,
      image: "../../public/puffs.png",
      description: "Desert adventures are the best",
      rating: 4,
      username: "Travel_Pro",
      comments: 29,
    },
    {
      id: 2,
      image: "../../public/puffs.png",
      description: "Perfect weekend getaway at the beach",
      rating: 5,
      username: "Dom_Hill",
      comments: 45,
    },
    {
      id: 3,
      image: "../../public/puffs.png",
      description: "Desert adveest",
      rating: 4,
      username: "Travel_Pro",
      comments: 29,
    },
    {
      id: 2,
      image: "../../public/puffs.png",
      description: "Perfect weqwdwff32rt2r23rekend getaway at the beach",
      rating: 5,
      username: "Dom_Hill",
      comments: 45,
    },
    {
      id: 3,
      image: "../../public/puffs.png",
      description: "Desert adventqwerrrrrrwrqqqqqqr3res are the best",
      rating: 4,
      username: "Travel_Pro",
      comments: 29,
    },
  ];
  const RatingStars = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    return (
      <div className="flex">
        {[...Array(5)].map((_, index) => (
          <Star
            key={index}
            className={`w-4 h-4 ${
              index < fullStars
                ? "text-yellow-400 fill-yellow-400"
                : index === fullStars && hasHalfStar
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Stories Section - More Square Shape */}
      <div className="mb-8 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 py-4">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0">
              <div className="w-40 h-40 rounded-lg overflow-hidden ring-2 ring-purple-500 p-0.5 bg-white relative">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <p className="text-white text-sm truncate">
                    {story.username}
                  </p>
                  <p className="text-white/80 text-xs truncate">
                    {story.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="break-inside-avoid mb-6 bg-white rounded-lg shadow-md"
          >
            <div className="relative">
              <img
                src={post.image}
                alt="Post content"
                className="w-full object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="none"
                  >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  <span className="ml-1">{post.rating} stars</span>
                </div>
                <div className="flex items-center text-gray-500 text-sm">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  <span>{post.comments} comments</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">{post.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSideComponent;
