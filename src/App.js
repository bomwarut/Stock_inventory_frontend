import React, { useState, useEffect } from 'react';
import './App.css';

const MyApp = () => {
  const [stocks, setStocks] = useState([]);
  useEffect( () => {
    const getProduct = async () => {
      try {
        console.log("getting product...");
        const response = await fetch(`http://localhost:5077/Product`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // console.log(await response.json());
        // Optionally fetch updated data after action
        return await response.json();
      } catch (error) {
        console.error('Error updating stock:', error);
      }
    };

    (async ()=>{
      let products = (await getProduct()).allProduct;
      let bodyTable = document.querySelector("#body-product")
      products.forEach(element => {
        console.log("kuyyyyyyyyyyyy"+element);
          bodyTable.innerHTML += `<tr><td>${element.product_name}</td></tr>`;
      });
    })();
   
  }, []);

  const fetchStocks = async () => {
    try {
      const response = await fetch('http://localhost:5077/weatherforecast');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleStockAction = async (stockId) => {
    try {
      const response = await fetch(`https://localhost:5001/api/updateStock/${stockId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ /* Any payload data if needed */ }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Optionally fetch updated data after action
      fetchStocks();
    } catch (error) {
      console.error('Error updating stock:', error);
    }
  };


  return (
    <div>
      <h1>Welcome to my Stock App</h1>
      <table>
        <thead>
          <tr key="test111">
            <th>ID</th>
      
          </tr>
        </thead>
        <tbody id="body-product">
     
       
        </tbody>
      </table>
    </div>
  );
};

export default MyApp;
