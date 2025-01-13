import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { auth, onAuthStateChanged, signOut } from "../../backend/firestore";
import { authStateListener, getUserProfile } from "../../backend/authService";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [user, setUser] = useState(null); // State to hold user info
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const unsubscribe = authStateListener(async (currentUser) => {
      if (currentUser) {
        try {
          const profile = await getUserProfile();
          setDisplayName(profile.displayName || "");
        } catch (error) {
          console.error("Error fetching profile data:", error.message);
        }
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("Auth state changed: ", authUser); // Debugging
      setUser(authUser);
    });
    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Function to handle link click
  const handleLinkClick = (link) => {
    setActiveLink(link); // Set active link
    setMenuOpen(false); // Close the menu for mobile view
  };

  // Sync active link with the current path
  useEffect(() => {
    setActiveLink(location.pathname + location.hash);
  }, [location]);

  // Function to handle LogOut
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        setUser(null); // Reset user state
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <nav className="flex justify-between items-center w-full px-4 md:pl-32 md:pr-36 md:pt-10 pt-4 bg-transparent text-white z-50 relative">
      <div className="text-3xl md:text-4xl font-semibold">
        <Link to="/" className="hover:text-[#fcb326] transition">
          careerCompass
        </Link>
      </div>

      <button
        className="block md:hidden text-3xl"
        onClick={toggleMenu}
        aria-label="Toggle Menu"
      >
        {menuOpen ? "✖" : "☰"}
      </button>

      {/* Normal Links for Desktop View */}
      <ul className="hidden md:flex space-x-10">
        <li className="group relative">
          <HashLink
            smooth
            to="/#about"
            className={`relative text-xl font-semibold hover:text-[#fcb326] transition duration-300 ease-out pb-1 ${
              activeLink === "/#about" ? "text-[#fcb326]" : ""
            }`}
            style={{
              fontFamily: "'Sevillana', cursive",
            }}
            onClick={() => handleLinkClick("/#about")}
          >
            About
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#fcb326] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left ${
                activeLink === "/#about" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </HashLink>
        </li>
        <li className="group relative">
          <Link
            to="/Career"
            className={`relative text-xl font-semibold hover:text-[#fcb326] transition duration-300 ease-out pb-1 ${
              activeLink === "/Career" ? "text-[#fcb326]" : ""
            }`}
            style={{
              fontFamily: "'Sevillana', cursive",
            }}
            onClick={() => handleLinkClick("/Career")}
          >
            Explore
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#fcb326] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left ${
                activeLink === "/Career" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </Link>
        </li>
        <li className="group relative">
          <Link
            to="/strategies"
            className={`relative text-xl font-semibold hover:text-[#fcb326] transition duration-300 ease-out pb-1 ${
              activeLink === "/strategies" ? "text-[#fcb326]" : ""
            }`}
            style={{
              fontFamily: "'Sevillana', cursive",
            }}
            onClick={() => handleLinkClick("/strategies")}
          >
            Strategies
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#fcb326]  scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left ${
                activeLink === "/strategies" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </Link>
        </li>
        <li className="group relative">
          <HashLink
            smooth
            to="/#contact"
            className={`relative text-xl font-semibold hover:text-[#fcb326] transition duration-300 ease-out pb-1 ${
              activeLink === "/#contact" ? "text-[#fcb326]" : ""
            }`}
            style={{
              fontFamily: "'Sevillana', cursive",
            }}
            onClick={() => handleLinkClick("/#contact")}
          >
            Contact
            <span
              className={`absolute left-0 bottom-0 w-full h-[2px] bg-[#fcb326] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left ${
                activeLink === "/#contact" ? "scale-x-100" : "scale-x-0"
              }`}
            ></span>
          </HashLink>
        </li>
        <li className="relative group">
          <button
            className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden focus:outline-none shadow-md"
            onClick={toggleProfileDropdown}
          >
            <span className="text-white text-lg font-bold">
              {displayName ? displayName[0].toUpperCase() : "?"}
            </span>
          </button>
          {profileDropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 scale-100 origin-top-right"
              style={{ zIndex: 50 }}
            >
              <div className="px-4 py-3 border-b">
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || "Not logged in"}
                </p>
              </div>
              <div className="py-2">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  onClick={() => handleLinkClick("/profile")}
                >
                  Profile
                </Link>
                {user ? (
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    LogOut
                  </button>
                ) : (
                  <Link
                    to="/authentication"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
                  >
                    LogIn
                  </Link>
                )}
              </div>
            </div>
          )}
        </li>
      </ul>

      {/* Dropdown Menu for Mobile View */}
      <div
  className={`fixed top-0 left-0 w-full bg-[#222222] text-white transition-transform duration-300 ease-in-out transform ${
    menuOpen ? "translate-y-0" : "-translate-y-full"
  } z-40`}
>
  <div className="flex justify-between items-center px-4 py-4">
    {/* Logo */}
    <div className="text-3xl font-semibold">
      <Link to="/" onClick={() => setMenuOpen(false)}>
        careerCompass
      </Link>
    </div>

    {/* Close Button */}
    <button
      className="text-3xl"
      onClick={toggleMenu}
      aria-label="Close Menu"
    >
      ✖
    </button>
  </div>

  {/* Profile Section */}
  <div className="flex items-center justify-center px-6 py-4">
    <div className="w-16 h-16 rounded-full bg-gray-500 flex items-center justify-center overflow-hidden">
      <span className="text-white text-lg font-bold">
        {displayName ? displayName[0].toUpperCase() : "?"}
      </span>
    </div>
    <Link
      to="/profile"
      className="ml-4 text-lg font-semibold hover:text-[#fcb326] transition"
      onClick={() => setMenuOpen(false)}
    >
      Profile
    </Link>
  </div>

  {/* Navigation Links */}
  <ul className="flex flex-col items-center space-y-6 pt-6 pb-8">
    <li>
      <HashLink
        smooth
        to="/#about"
        className={`text-lg font-semibold px-6 py-3 rounded-full transition duration-300 ease-in-out ${
          activeLink === "/#about"
            ? "bg-[#fcb326] text-gray-900"
            : "hover:text-[#fcb326]"
        }`}
        onClick={() => handleLinkClick("/#about")}
      >
        About
      </HashLink>
    </li>
    <li>
      <Link
        to="/Career"
        className={`text-lg font-semibold px-6 py-3 rounded-full transition duration-300 ease-in-out ${
          activeLink === "/Career"
            ? "bg-[#fcb326] text-gray-900"
            : "hover:text-[#fcb326]"
        }`}
        onClick={() => handleLinkClick("/Career")}
      >
        Explore
      </Link>
    </li>
    <li>
      <Link
        to="/strategies"
        className={`text-lg font-semibold px-6 py-3 rounded-full transition duration-300 ease-in-out ${
          activeLink === "/strategies"
            ? "bg-[#fcb326] text-gray-900"
            : "hover:text-[#fcb326]"
        }`}
        onClick={() => handleLinkClick("/strategies")}
      >
        Strategies
      </Link>
    </li>
    <li>
      <HashLink
        smooth
        to="/#contact"
        className={`text-lg font-semibold px-6 py-3 rounded-full transition duration-300 ease-in-out ${
          activeLink === "/#contact"
            ? "bg-[#fcb326] text-gray-900"
            : "hover:text-[#fcb326]"
        }`}
        onClick={() => handleLinkClick("/#contact")}
      >
        Contact
      </HashLink>
    </li>

    {/* Conditional Rendering for Login/Logout */}
    <li>
      {user ? (
        <button
          onClick={handleLogout}
          className="text-lg font-semibold px-6 py-3 transition duration-300 ease-in-out"
        >
          LogOut
        </button>
      ) : (
        <Link
          to="/authentication"
          className="text-lg font-semibold px-6 py-3 transition duration-300 ease-in-out"
        >
          LogIn
        </Link>
      )}
    </li>
  </ul>
</div>

    </nav>
  );
}
