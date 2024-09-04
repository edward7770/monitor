import React, { useState } from "react";
import axios from "axios";

const CityDropdown = (props) => {
  const [cities, setCities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const fetchCities = async (text) => {
    try {
      if (text.trim().length <= 2) return;
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&city=${text}&limit=10&addressdetails=1`
      );
      const filteredCities = response.data
        .filter(
          (city) =>
            (city.address.city &&
              city.address.city.toLowerCase().includes(text.toLowerCase())) ||
            (city.address.municipality &&
              city.address.municipality
                .toLowerCase()
                .includes(text.toLowerCase()))
        )
        .map((city) => {
          const address = `${
            city.address.municipality ? city.address.municipality + ", " : ""
          }${city.address.city ? city.address.city + ", " : ""}${
            city.address.state ? city.address.state + ", " : ""
          }${city.address.country}`;
          return {
            place_id: city.place_id,
            display_name: address,
            cityName: city.address.city,
            stateName: city.address.state,
            countryName: city.address.country
          };
        });
      setCities(filteredCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchText(value);

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      setSearchText(value);
      fetchCities(value);
    }, 500);

    setTimeoutId(newTimeoutId);

    setIsOpen(true);
  };

  const handleOptionClick = (city) => {
    props.handleOptionClick(props.role, city);

    if(city.stateName) {
        setSearchText(city.cityName + " , " + city.stateName);
    } else {
        setSearchText(city.cityName);
    }
    setIsOpen(false);
  };

  return (
    <div style={{ position: "relative" }} className="form-group">
      <input
        type="text"
        value={searchText}
        className="form-control"
        onChange={handleInputChange}
        placeholder="City"
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && (
        <ul className="z-10 absolute left-0 w-full bg-white border border-[#efefef] m-0 max-h-80">
          {cities.map((city, index) => (
            <li
              className="py-2 px-4 text-left cursor-pointer hover:text-slate-500 hover:bg-gray-100 border-b"
              key={city.place_id || index}
              onClick={() => handleOptionClick(city)}
            >
                {city.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CityDropdown;
