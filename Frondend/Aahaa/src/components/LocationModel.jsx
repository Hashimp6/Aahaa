import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { updateUserDetails } from "../redux/slices/authSlice"; // Adjust the path

const LocationSelector = ({ onClose }) => {
  const [searchValue, setSearchValue] = useState("");
  const [mapCenter, setMapCenter] = useState({ lat: 51.5074, lng: -0.1278 });
  const [markerPosition, setMarkerPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isGeolocationSupported, setIsGeolocationSupported] = useState(true);
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  const dispatch = useDispatch();
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  const markerRef = useRef(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.geolocation) {
      setIsGeolocationSupported(false);
    }
  }, []);

  useEffect(() => {
    if (window.google && !mapRef.current && mapContainerRef.current) {
      initializeMap();
    }
  }, []);
  const handleConfirmLocation = async () => {
    setLoading(true);
    try {
      console.log(
        "address is ",
        address,
        "coordinates",
        coordinates,
        "user",
        userId
      );

      const response = await axios.patch(`/api/auth/user/${userId}`, {
        address,
        coordinates,
      });

      const { data } = response;

      // Update Redux state after successful backend update
      dispatch(
        updateUserDetails({
          address: data.user.contact.address,
          coordinates: data.user.location.coordinates,
        })
      );
      console.log("Location updated successfully:", data);
      navigate("/home");
    } catch (error) {
      console.error(
        "Error updating location:",
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const initializeMap = () => {
    try {
      const map = new window.google.maps.Map(mapContainerRef.current, {
        center: mapCenter,
        zoom: 15,
        disableDefaultUI: true,
        zoomControl: true,
        mapId: "YOUR_MAP_ID", // Replace with your Map ID from Google Cloud Console
      });

      mapRef.current = map;
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(map);

      map.addListener("click", (e) => {
        const clickedLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        handleMapClick(clickedLocation);
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      setError("Failed to initialize map");
    }
  };

  const updateMarker = (position) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.setMap(null);
    }

    try {
      const marker = new window.google.maps.Marker({
        position,
        map: mapRef.current,
        title: "Selected Location",
        animation: window.google.maps.Animation.DROP,
      });

      markerRef.current = marker;
      setMarkerPosition(position);
      setCoordinates(position);
    } catch (error) {
      console.error("Error creating marker:", error);
      setError("Failed to place marker");
    }
  };

  const handleMapClick = async (location) => {
    setIsLoading(true);
    setError("");

    try {
      updateMarker(location);
      mapRef.current?.panTo(location);
      await fetchAddressFromCoords(location.lat, location.lng);
    } catch (err) {
      setError("Failed to get address for clicked location");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchInput = async (value) => {
    setSearchValue(value);
    if (!value.trim() || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    try {
      const result = await new Promise((resolve, reject) => {
        autocompleteService.current.getPlacePredictions(
          { input: value },
          (predictions, status) => {
            if (status === "OK") resolve(predictions);
            else reject(new Error("Place search failed"));
          }
        );
      });
      setPredictions(result);
    } catch (err) {
      setError("Place search failed");
      setPredictions([]);
    }
  };

  const handlePlaceSelect = async (placeId) => {
    setIsLoading(true);
    setError("");
    setPredictions([]);

    try {
      if (!placesService.current)
        throw new Error("Places service not available");

      const place = await new Promise((resolve, reject) => {
        placesService.current.getDetails(
          { placeId, fields: ["formatted_address", "geometry"] },
          (place, status) => {
            if (status === "OK") resolve(place);
            else reject(new Error("Place details not found"));
          }
        );
      });

      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      updateMarker(location);
      mapRef.current?.panTo(location);
      mapRef.current?.setZoom(15);
      setAddress(place.formatted_address);
      setSearchValue(place.formatted_address);
    } catch (err) {
      setError("Failed to get place details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError("");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        });
      });

      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      updateMarker(location);
      mapRef.current?.panTo(location);
      mapRef.current?.setZoom(15);
      await fetchAddressFromCoords(location.lat, location.lng);
    } catch (err) {
      setError(
        "Unable to fetch your location. Please ensure location services are enabled."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === "OK" && results[0]) resolve(results);
          else reject(new Error("Unable to fetch address"));
        });
      });
      const formattedAddress = results[0].formatted_address;
      setAddress(formattedAddress);
      setSearchValue(formattedAddress);
    } catch (err) {
      throw new Error("Unable to fetch address");
    }
  };

  const handleSubmit = () => {
    console.log("Final Coordinates:", coordinates);
    console.log("Final Address:", address);
  };

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-lg">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Close modal"
      >
        <X className="h-8 w-8 bg-white " />
      </button>
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Select Location</h2>

        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <div className="relative">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearchInput(e.target.value)}
                placeholder="Search for a location..."
                className="w-full px-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Search Predictions */}
            {predictions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => handlePlaceSelect(prediction.place_id)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                  >
                    <p className="text-sm">{prediction.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Current Location Button */}
          {isGeolocationSupported && (
            <button
              onClick={handleCurrentLocation}
              disabled={isLoading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              Use Current Location
            </button>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              {error}
            </div>
          )}

          {/* Map Container */}
          <div
            ref={mapContainerRef}
            className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"
          />

          {/* Selected Location Info */}
          {address && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Selected Location:</p>
              <p className="font-medium">{address}</p>
              {coordinates && (
                <p className="text-sm text-gray-500 mt-1">
                  Coordinates: {coordinates.lat.toFixed(6)},{" "}
                  {coordinates.lng.toFixed(6)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Button */}
      <div className="px-6 py-4 bg-gray-50 border-t">
        <button
          onClick={handleConfirmLocation}
          className={`w-full flex items-center justify-center px-4 py-2 text-white rounded-lg ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Updating...</span>
            </div>
          ) : (
            "Confirm Location"
          )}
        </button>
      </div>
    </div>
  );
};
export default LocationSelector;
