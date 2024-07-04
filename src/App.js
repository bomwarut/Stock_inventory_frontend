import React, { useState, useEffect } from 'react';
import './App.css';

const MyApp = () => {
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  const [history, setHistory] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const [productQuantities2, setProductQuantities2] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5077/Product', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setProducts(result.showdata);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await fetch('http://localhost:5077/Product/stocks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setStock(result.showdata);
      } catch (error) {
        console.error('Error fetching stock:', error);
      }
    };
    fetchStock();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('http://localhost:5077/Product/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result = await response.json();
        setHistory(result.showdata);
      } catch (error) {
        console.error('Error fetching history:', error);
      }
    };
    setTimeout(() => {
    fetchHistory();
    }, 500);
  }, []);

  const addStock = async (productId) => {
    const quantity = productQuantities[productId] || 1;
    try {
      const response = await fetch('http://localhost:5077/Product/addStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success) {
        if (result.updatedStock) {
          setStock(stock.map(s => s.stock_id === result.updatedStock.stock_id ? result.updatedStock : s));
        } else if (result.newStock) {
          setStock([...stock, result.newStock]);
        }
        const responseHistory = await fetch('http://localhost:5077/Product/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!responseHistory.ok) {
          throw new Error('Network response was not ok');
        }
        const resultHistory = await responseHistory.json();
        setHistory(resultHistory.showdata);
      } else {
        console.error('Failed to add stock');
      }
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  const withdrawStock = async (productId) => {
    const quantity = productQuantities2[productId] || 1;
    try {
      const response = await fetch('http://localhost:5077/Product/withdrawStock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      if (result.success) {
        if (result.updatedStock) {
          setStock(stock.map(s => s.stock_id === result.updatedStock.stock_id ? result.updatedStock : s));
        }
        const responseHistory = await fetch('http://localhost:5077/Product/history', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!responseHistory.ok) {
          throw new Error('Network response was not ok');
        }
        const resultHistory = await responseHistory.json();
        setHistory(resultHistory.showdata);
      } else {
        console.error('Failed to withdraw stock');
      }
    } catch (error) {
      window.alert('จำนวนของสินค้าหมดแล้ว');
      console.error('Error withdrawing stock:', error);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setProductQuantities({
      ...productQuantities,
      [productId]: quantity,
    });
  };

  const handleQuantityChange2 = (productId, quantity) => {
    setProductQuantities2({
      ...productQuantities2,
      [productId]: quantity,
    });
  };

  return (
    <div id='background'>
      <div>
        <h2>ตารางสินค้า</h2>
        <table>
          <thead>
            <tr>
              <th className='textleft'>ชื่อสินค้า</th>
              <th>รหัสสินค้า</th>
              <th className='textright'>ราคา</th>
              <th className='textright'>จำนวน</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.product_id}>
                <td className='textleft'>{product.product_name}</td>
                <td>{product.product_code}</td>
                <td className='textright'>{product.product_price}</td>
                <td>
                  <input className='textright'
                    type="number"
                    value={productQuantities[product.product_id] || 1}
                    onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <button type='button' onClick={() => addStock(product.product_id)}>
                    เพิ่มสินค้าเข้าคลัง
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>ตารางคลังสินค้า</h2>
        <table>
          <thead>
            <tr>
              <th>stock id</th>
              <th>product id</th>
              <th className='textleft'>ชื่อสินค้า</th>
              <th className='textright'>จำนวนสินค้าในคลัง</th>
              <th>วันทีเพิ่ม</th>
              <th className='textright'>จำนวนเบิกออก</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stock.map(stockItem => (
              <tr key={stockItem.stock_id}>
                <td>{stockItem.stock_id}</td>
                <td>{stockItem.product_id}</td>
                <td className='textleft'>{stockItem.product_name}</td>
                <td className='textright'>{stockItem.product_quantity}</td>
                <td>{stockItem.stock_update_at}</td>
                <td>
                  <input className='textright'
                    type="number"
                    value={productQuantities2[stockItem.product_id] || 1}
                    onChange={(e) => handleQuantityChange2(stockItem.product_id, parseInt(e.target.value))}
                  />
                </td>
                <td>
                  <button className="btn btn-primary" type='button' onClick={() => withdrawStock(stockItem.product_id)}>
                    เบิกออก
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>ตารางรายการ รับ เบิก สินค้าคงคลัง</h2>
        <table>
          <thead>
            <tr>
              <th>history id</th>
              <th>stock id</th>
              <th className='textright'>จำนวนสินค้าในคลัง</th>
              <th className='textleft'>ประเภท</th>
              <th>วันทีเพิ่ม</th>
            </tr>
          </thead>
          <tbody>
            {history.map(historyItem => (
              <tr key={historyItem.stock_history_id}>
                <td>{historyItem.stock_history_id}</td>
                <td>{historyItem.stock_id}</td>
                <td className='textright'>{historyItem.quantity}</td>
                <td className='textleft'>
                  {historyItem.stock_type === 1 ? 'รับสินค้า' : 'เบิกสินค้า'}
                </td>
                <td>{historyItem.stock_history_update_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApp;