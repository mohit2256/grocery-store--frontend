import React, { useEffect, useState } from "react";

export default function TestAPI() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/products");
        const json = await res.json();
        console.log("Fetched data:", json);
        setData(json);
      } catch (err) {
        console.error("Error fetching:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Test</h1>
      {data.length === 0 ? (
        <p>No data found...</p>
      ) : (
        data.map((item) => (
          <div key={item._id}>
            <h3>{item.title}</h3>
            <p>₹{item.price} / {item.unit}</p>
          </div>
        ))
      )}
    </div>
  );
}
