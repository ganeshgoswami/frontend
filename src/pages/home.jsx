import React, { useContext, useState } from "react";
import { AuthContext } from "../context/mycontext";

const Home = () => {
  const { books, user, setUser,orders, setbooks,neworderBook } = useContext(AuthContext);
  const [showCart, setShowCart] = useState(false); // State to control cart modal visibility


  const addtocart = (id) => {
    // Find the book by id
    const findBook = id ? books.find((bk) => bk._id === id) : null;
  
    if (findBook && findBook.Quantity > 0) {  // Check if the book exists and is in stock
      // Check if the book already exists in the cart
      const existBookIndex = orders.cart.items.findIndex((item) => item.id === id);
  
      if (existBookIndex >= 0) {
        // If the book already exists in the cart, increase the quantity
        orders.cart.items[existBookIndex].BookQuantity += 1;
      } else {
        // If the book does not exist in the cart, add it as a new item
        const cartItem = {
          userId: id,
          items: [
            {
              id: findBook._id,
              BookName: findBook.BookName,
              Image: findBook.Image,
              Price: findBook.Price,
              BookQuantity: 1, // Starting quantity
            }
          ],
        };
  
        // Add the new item to the cart
        orders.cart.items.push(cartItem.items[0]);
      }
    } else {
      alert("Book not available in stock or invalid ID.");
    }
  };
  
  

  const bookPayment = () => {
    
    // Assuming neworderBook is a function that saves the user's cart in the backend
    if (user && user.cart && user.cart.length > 0) {
      neworderBook(user._id, user.cart)
    }
  };


  
  const totalPayment=(cart) => cart ? cart.reduce((pre, curr) => {
    return pre + curr.price * curr.bookQuantity;
  }, 0) : 0 ;
  

  const toggleCart = () => {
    setShowCart(!showCart); // Toggle cart visibility
  };

  return (
    <div className="container m-2">
      <div className="row">
        {books.length > 0 ? (
          books.map((book) => (
            <>
              {!book.Stock ? (
                <div
                  className="col-lg-4 col-md-6 col-sm-12 mb-3"
                  key={book._id}
                >
                  <div className="card h-100 p-2 text-center shadow-lg p-3 mb-5 bg-body-tertiary rounded">
                    <div className={book.Stock ? "opacity-50" : ""}>
                      <h5 className="text-danger">
                        {book.BookName} {" (By " + book.Writer + ")"}
                      </h5>
                      <div className="text-center">
                        <img
                          src={book.Image}
                          alt={book.title}
                          className="img-fluid"
                          style={{ maxWidth: "150px", maxHeight: "120px" }}
                        />
                      </div>
                      <div className="card-body">
                        <p className="card-text">
                          <span className="text-success">
                            <b>Title:</b> {book.Titel}
                          </span>
                        </p>
                        <p>
                          <b>Price: </b>₹ <b>{book.Price}.00 </b>{" "}
                          <del className="text-danger">
                            <small>₹{(book.Price / 100) * 110}.00</small>
                          </del>
                        </p>
                        <p>
                          <b>Available: </b> {book.Quantity} copies
                        </p>
                      </div>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => addtocart(book._id)}
                        disabled={book.Quantity <= 0}
                      >
                        {book.Quantity > 0 ? "Buy" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                ""
              )}
            </>
          ))
        ) : (
          <p>No Books found.</p>
        )}
      </div>

      {/* Cart Modal */}
      {showCart && (
        <div className="cart-modal shadow-lg" style={modalStyle}>
            <h5 className="text-center">Cart</h5>
          <div className="m-2">
            <button
              type="button"
              className="btn-close float-end"
              aria-label="Close"
              onClick={toggleCart}
            ></button>
          </div>
          <div className="cart-content p-3 m-2">
            {user.cart && user.cart.length > 0 ? (
              user.cart.map((item) => (
                <div
                  key={item.id}
                  className="d-flex justify-content-between my-2"
                >
                  <div>
                    <img
                      src={item.image}
                      alt={item.bookName}
                      style={{ width: "50px", height: "50px" }}
                    />
                    <span className="ms-2">{item.bookName}</span>
                  </div>
                  <div>
                    <span>Qty: {item.bookQuantity}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center">Your cart is empty.</p>
            )}
          </div>
          <div className="text-center">
            
            <button className="btn btn-sm btn-primary" onClick={bookPayment} >Payment  (Pay {totalPayment(user.cart)} ₹ )</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;

// Styles for the cart modal
const modalStyle = {
  position: "fixed",
  right: "20px",
  bottom: "0",
  width: "300px",
  height: "50vh",
  backgroundColor: "white",
  zIndex: 1000,
  overflowY: "auto",
  borderRadius: "15px"
};
