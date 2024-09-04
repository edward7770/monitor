import React, { useEffect, useState } from "react";
import axios from "axios";

const ProvinceDropDown = (props) => {
  const [cities, setCities] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const { defaultselected } = props;

  const fetchCities = async (text) => {
    try {
      if (text.trim().length <= 1) return;
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&country=${text}&limit=10&addressdetails=1`
      );

      setCities(response.data);
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

  const handleOptionClick = (country) => {
    props.handleOptionClick(props.role, country);

    setSearchText(country.display_name);
    setIsOpen(false);
  };

  useEffect(() => {
    if(defaultselected !== "") {
        setSearchText(defaultselected);
    }
  },[defaultselected]);

  return (
    <div style={{ position: "relative" }} className="form-group">
      <input
        type="text"
        value={searchText}
        className="form-control"
        onChange={handleInputChange}
        placeholder="Province"
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

export default ProvinceDropDown;
