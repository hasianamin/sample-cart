import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Home() {
  const [carts, setCarts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCarts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:4000/cart?userId=1');
      setCarts(data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  const updateCart = async (type, cart) => {
    try {
      let amount;
      if (type === 'inc') amount = 1;
      else amount = -1;
      await axios.put(`http://localhost:4000/cart/${cart.id}`, {
        userId: cart.userId,
        productId: cart.productId,
        amount: cart.amount + amount,
      });
      fetchCarts();
      countTotalPrice();
    } catch (error) {
      console.log(error);
    }
  };

  const countTotalPrice = () => {
    const result = carts.reduce(
      (acc, curr) => acc + curr.amount * curr.product.price,
      0,
    );
    return result;
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  const renderCarts = () => {
    return carts.map((cart) => {
      return (
        <div key={cart.id} style={{ display: 'flex', gap: '10px' }}>
          <div>name -</div>
          <div>{cart.product.name},</div>
          <div>price -</div>
          <div>{cart.product.price},</div>
          <button onClick={() => updateCart('dec', cart)}>-</button>
          <div>{cart.amount}</div>
          <button onClick={() => updateCart('inc', cart)}>+</button>
          <div>{cart.product.price * cart.amount}</div>
        </div>
      );
    });
  };

  return (
    <div>
      <h3>Cart</h3>
      {loading ? 'loading...' : renderCarts()}
      <h6>Total</h6>
      <h7>{countTotalPrice()}</h7>
    </div>
  );
}
