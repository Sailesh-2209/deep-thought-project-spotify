import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router";
import { baseURL } from "../constants/baseURL";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Categories() {
  const authContext = useContext(AuthContext);
  const { accessToken } = authContext;
  const history = useHistory();
  const [categories, setCategories] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categories) return;
    axios
      .post(`${baseURL}/categories`, {
        accessToken,
      })
      .then((response) => {
        console.log(response.data.body);
        setCategories(response.data.body);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
        setCategories(null);
        history.push("/");
      });
  });

  return (
    <div className="home-container">
      <Navbar />
      <div className="categories-container">
        {categories ? (
          categories.map((category) => {
            const id = category.id;
            const name = category.name;
            const icon = category.icons[0].url;
            return (
              <div
                key={id}
                className="category-card"
                onClick={() => history.push(`categories/${id}`)}
              >
                <div>
                  <img src={icon} alt={name} />
                </div>
                <div>{name}</div>
              </div>
            );
          })
        ) : (
          <div>{error ? error.message : "error"}</div>
        )}
      </div>
    </div>
  );
}
