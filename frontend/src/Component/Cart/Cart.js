import "./Cart.css";
import Cookies from "js-cookie";
import Header from "../Header/Header";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Cart = () => {
  const [cart, setCart] = useState([]); // Initialize cart state
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const notify = (msg) => toast.success(msg);
  const notifyError = (msg) => toast.error(msg);

  // Fetch all products
  const fetchProducts = useCallback(() => {
    axios
      .get("https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/allProducts")
      .then((response) => {
        setAllProducts(response.data.data); // Store all products
      })
      .catch((error) => {
        notifyError("Error fetching products");
      });
  }, []); // Empty array ensures fetchProducts doesn't change between renders

  // Fetch cart items
  const fetchCart = useCallback(() => {
    axios
      .get("https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/cart")
      .then((response) => {
        setCart(response.data.data); // Store cart items
      })
      .catch((error) => {
        notifyError("Error fetching cart");
      });
  }, []); // Empty array ensures fetchCart doesn't change between renders

  useEffect(() => {
    fetchProducts(); // Fetch all products
    fetchCart(); // Fetch cart items
  }, [fetchProducts, fetchCart]); // Dependencies to ensure useEffect doesn't rerun unnecessarily

  // Function to delete a product from the cart
  const deletingProductfromCart = async (id) => {
    try {
      await axios.delete(`https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/deleteItemFromCart/${id}`);
      notify("Deleted one item from cart");
      // Remove the item from the cart state after successful deletion
      setCart(cart.filter((product) => product._id !== id));
    } catch (error) {
      notifyError("There was an error deleting the item from the cart");
    }
  };

  // Check if the user is Admin
  const check = Cookies.get("user");

  // Find the product details for the items in the cart
  const getProductDetails = (productId) => {
    return allProducts.find((product) => product.product_id === productId);
  };

  // Calculate the total price for all products in the cart
  const calculateTotalPrice = () => {
    return cart.reduce((total, cartItem) => {
      const productDetails = getProductDetails(cartItem.product_id);
      return productDetails ? total + (productDetails.price || 0) : total;
    }, 0);
  };

  // Delete all items in the cart
  const deleteAllItemsInCart = () => {
    axios
      .delete("https://joyful-yeot-66133c.netlify.app/.netlify/functions/api/deleteAllItemsInCart")
      .then(() => {
        setCart([]);
        notify("All items deleted from cart");
      })
      .catch((error) => {
        notifyError("There was an error deleting all items from the cart");
      });
  };

  if (check === "User") {
    return (
      <div className="arrangeHeadBody">
        <Header />
        <div className="bodyPart">
          <h1>Cart</h1>

          {/* Check if the cart is empty */}
          {cart.length === 0 ? (
            <h2>No items in cart</h2>
          ) : (
            <div className="body-part-dashboard">
              <div className="body-part-allProducts">
                <table style={{ width: "100%", height: "fit-content" }}>
                  <thead>
                    <tr>
                      <th>Product ID</th>
                      <th>Product Name</th>
                      <th>Price</th>
                      <th>Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((cartItem, index) => {
                      const productDetails = getProductDetails(cartItem.product_id);
                      return productDetails ? (
                        <tr key={index}>
                          <td>{productDetails.product_id}</td>
                          <td>{productDetails.name}</td>
                          <td>{productDetails.price || "N/A"}</td>
                          <td>
                            <img
                              src={productDetails.imageUrl}
                              alt={productDetails.name}
                              style={{ height: "100px", width: "100px" }}
                            />
                          </td>
                          <td>
                            <button
                              onClick={() =>
                                deletingProductfromCart(cartItem._id)
                              }
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ) : null; // If product details are not found, skip rendering
                    })}
                  </tbody>
                </table>

                {/* Display the total price */}
                <br />
                <div style={{ margin: "10px" }}>
                  <h3>Total Price: {calculateTotalPrice()}</h3>
                  {/* Display the scanner image below the cart */}
                  <div>
                    <h3>Scan to Pay</h3>
                    <img
                      src="https://res.cloudinary.com/dafmi9027/image/upload/v1729323100/WhatsApp_Image_2024-10-19_at_12.59.55_63aa515d_hn1hpx.jpg" // Replace with your scanner image URL
                      alt="Phone Pay Scanner"
                      style={{ width: "300px", height: "auto" }}
                    />
                  </div>
                  <p>If payment done, click on this</p>
                  <button onClick={deleteAllItemsInCart}>Done</button>
                </div>
              </div>
            </div>
          )}

          <Toaster />
        </div>
      </div>
    );
  }

  return null; // Return null if not an Admin
};

export default Cart;
