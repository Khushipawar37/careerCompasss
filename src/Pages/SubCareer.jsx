import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, ArrowRight, Heart } from "lucide-react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer/Footer";
import careerData from "../Components/Career/careerData";
import { authStateListener, updateUserProfile, getUserProfile } from "../../backend/authService";
import "../Styles/subCar.css";

const SubCar = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [favourites, setFavourites] = useState([]);
  const [user, setUser] = useState(null);

  const selectedCategory = careerData.find(
    (category) => category.id === parseInt(id)
  );

  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const profile = await getUserProfile();
        setFavourites(profile.favourites || []);
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleFavourite = async (career) => {
    if (!user) {
      alert("Please sign in to add favourites.");
      return;
    }

    let updatedFavourites;
    if (favourites.includes(career)) {
      updatedFavourites = favourites.filter((fav) => fav !== career);
    } else {
      updatedFavourites = [...favourites, career];
    }

    setFavourites(updatedFavourites);
    await updateUserProfile({ favourites: updatedFavourites });
  };

  const filteredCareers = useMemo(() => {
    return selectedCategory.careers.filter((career) =>
      career.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [selectedCategory.careers, searchTerm]);

  if (!selectedCategory) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mt-12 mx-auto px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-6 sm:mb-16 text-[#fcb326]">
          Explore Careers in {selectedCategory.category}
        </h1>
        <div className="relative max-w-xl mx-auto mb-8 sm:mb-10">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search careers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-700 bg-gray-800 text-white rounded-full focus:outline-none focus:border-indigo-500 transition duration-300 placeholder-gray-400"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7 px-2 sm:px-0">
          {filteredCareers.map((career, index) => (
            <div
              key={index}
              className="group relative transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <Link to={`/career/${encodeURIComponent(career)}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 flex flex-col justify-between min-h-[300px] h-auto">
                  {/* Card Content */}
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="w-12 h-12 bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl text-indigo-300">
                        {career.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">
                      {career}
                    </h3>
                    <p className="text-gray-400 line-clamp-3 flex-grow">
                      Explore the exciting world of {career} and discover the
                      opportunities that await you in this dynamic field.
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="bg-indigo-900/30 p-3 group-hover:bg-indigo-900/50 transition-colors duration-300">
                    <div className="flex items-center justify-between text-indigo-300 group-hover:text-indigo-200">
                      <span className="font-medium">Explore More</span>
                      <ArrowRight className="transform group-hover:translate-x-1 transition duration-300" />
                    </div>
                  </div>
                </div>
              </Link>

              {/* Favourite Icon */}
              <button
                onClick={() => toggleFavourite(career)}
                className="absolute top-4 right-4 p-2 bg-gray-700/50 rounded-full hover:bg-gray-700/70 transition-colors duration-300"
              >
                <Heart
                  className={`w-6 h-6 ${
                    favourites.includes(career) ? "text-red-500 fill-red-500" : "text-gray-300"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SubCar;