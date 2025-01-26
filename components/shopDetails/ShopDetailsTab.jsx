"use client";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import toast, { Toaster } from "react-hot-toast";
import { updateSingleProductRedux } from "@/actions";
const tabs = [
  { title: "Description", active: true },
  { title: "Reviews", active: false },
  { title: "Add Review", active: false },
];

const ShopDetailsTab = ({ product, currentUser, updateSingleProductRedux }) => {
  const [currentTab, setCurrentTab] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [loader, setLoader] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  return (
    <section
      className="flat-spacing-17 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-has-border">
              <ul
                className="widget-menu-tab"
                style={{ justifyContent: "center" }}
              >
                {tabs.map((elm, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentTab(i + 1)}
                    className={`item-title ${
                      currentTab == i + 1 ? "active" : ""
                    } `}
                  >
                    <span className="inner">{elm.title}</span>
                  </li>
                ))}
              </ul>
              <div className="widget-content-tab">
                <div
                  className={`widget-content-inner ${
                    currentTab == 1 ? "active" : ""
                  } `}
                >
                  <div
                    className=""
                    dangerouslySetInnerHTML={{ __html: product.description }}
                  ></div>
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 2 ? "active" : ""
                  } `}
                >
                  <div style={{ marginTop: 10, padding: 10 }}>
                    {product.reviews && product.reviews.length > 0 ? (
                      product.reviews.map((review, index) => (
                        <div style={{ marginBottom: 40 }} key={index}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <div
                              style={{ display: "flex", flexDirection: "row" }}
                            >
                              <i
                                className="icofont-ui-user"
                                style={{ fontSize: 20 }}
                              ></i>
                              <div
                                style={{
                                  marginLeft: 10,
                                  marginTop: 3,
                                  alignSelf: "flex-start",
                                  alignItems: "flex-start",
                                }}
                              >
                                {review.user.displayName}

                                <div className="rating">
                                  <i
                                    className="icon-start"
                                    style={{
                                      color:
                                        review.star > 0
                                          ? "orange"
                                          : "gainsboro",
                                    }}
                                  />
                                  <i
                                    className="icon-start"
                                    style={{
                                      color:
                                        review.star > 1
                                          ? "orange"
                                          : "gainsboro",
                                    }}
                                  />
                                  <i
                                    className="icon-start"
                                    style={{
                                      color:
                                        review.star > 2
                                          ? "orange"
                                          : "gainsboro",
                                    }}
                                  />
                                  <i
                                    className="icon-start"
                                    style={{
                                      color:
                                        review.star > 3
                                          ? "orange"
                                          : "gainsboro",
                                    }}
                                  />
                                  <i
                                    className="icon-start"
                                    style={{
                                      color:
                                        review.star > 4
                                          ? "orange"
                                          : "gainsboro",
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                            <div style={{ alignItems: "flex-end" }}>
                              <span
                                style={{
                                  color: "#444",
                                  marginTop: 3,
                                  fontSize: 14,
                                }}
                              >
                                {review.date}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div
                              style={{
                                color: "#555",
                                textAlign: "left",
                                marginTop: 6,
                                fontSize: 14,
                              }}
                            >
                              {review.reviewText}
                            </div>
                            {review.imageUrl && review.imageUrl !== "" ? (
                              <div
                                style={{
                                  borderColor: "gainsboro",
                                  borderWidth: 1,
                                  height: 100,
                                  width: 100,
                                  borderRadius: 10,
                                  marginTop: 7,
                                }}
                              >
                                <img
                                  src={review.imageUrl}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: 10,
                                  }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          marginTop: 10,
                          marginBottom: 130,
                          color: "#666",
                          fontWeight: "bold",
                          fontSize: 17,
                        }}
                      >
                        This Product has no reviews yet.
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`widget-content-inner ${
                    currentTab == 3 ? "active" : ""
                  } `}
                >
                  {currentUser &&
                  currentUser.uid &&
                  product.reviews &&
                  product.reviews.length > 0 &&
                  product.reviews.find(
                    (review) => review.id == currentUser.uid
                  ) ? (
                    <div>You have already added a review for this product</div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: 15,
                            textAlign: "center",
                          }}
                        >
                          Rate The Product
                        </div>
                        <div className="rating">
                          <i
                            className="icon-start"
                            style={{
                              fontSize: 50,
                              color: rating > 0 ? "orange" : "gainsboro",
                            }}
                            onClick={() => {
                              setRating(1);
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              fontSize: 50,
                              color: rating > 1 ? "orange" : "gainsboro",
                            }}
                            onClick={() => {
                              setRating(2);
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              fontSize: 50,
                              color: rating > 2 ? "orange" : "gainsboro",
                            }}
                            onClick={() => {
                              setRating(3);
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              fontSize: 50,
                              color: rating > 3 ? "orange" : "gainsboro",
                            }}
                            onClick={() => {
                              setRating(4);
                            }}
                          />
                          <i
                            className="icon-start"
                            style={{
                              fontSize: 50,
                              color: rating > 4 ? "orange" : "gainsboro",
                            }}
                            onClick={() => {
                              setRating(5);
                            }}
                          />
                        </div>
                        <div
                          style={{
                            fontWeight: "bold",
                            fontSize: 15,
                            textAlign: "center",
                            marginTop: 35,
                          }}
                        >
                          Please share your opinion about the product
                        </div>
                        <textarea
                          name="message"
                          rows={4}
                          value={review}
                          placeholder="Enter your text here (optional)"
                          className=""
                          tabIndex={2}
                          aria-required="true"
                          onChange={(e) => {
                            setReview(e.target.value);
                          }}
                          required
                          style={{ borderRadius: 5, marginTop: 10 }}
                        />
                        <div
                          className="tf-btn btn-fill justify-content-center fw-6 fs-16 flex-grow-1 animate-hover-btn "
                          style={{ display: "flex", marginTop: 8 }}
                          onClick={async () => {
                            setLoader(true);
                            let date = new Date();
                            await updateSingleProductRedux({
                              ...product,
                              reviews:
                                product.reviews && product.reviews.length > 0
                                  ? [
                                      {
                                        user: currentUser
                                          ? currentUser
                                          : { displayName: "Anonymus" },
                                        id: currentUser
                                          ? currentUser.uid
                                          : Math.floor(
                                              Math.random() * (9999 - 1000 + 1)
                                            ) + 1000,
                                        reviewText: review,
                                        star: rating,
                                        date: date.toLocaleDateString("en-GB"),
                                        imageUrl: imageUrl ? imageUrl : "",
                                        time: date.getTime().toString(),
                                      },
                                      ...product.reviews,
                                    ]
                                  : [
                                      {
                                        user: currentUser
                                          ? currentUser
                                          : { displayName: "Anonymus" },
                                        id: currentUser
                                          ? currentUser.uid
                                          : Math.floor(
                                              Math.random() * (9999 - 1000 + 1)
                                            ) + 1000,
                                        reviewText: review,
                                        star: rating,
                                        date: date.toLocaleDateString("en-GB"),
                                        imageUrl: imageUrl ? imageUrl : "",
                                        time: date.getTime().toString(),
                                      },
                                    ],
                            });
                            setReview("");
                            setRating(0);
                            setCurrentTab(2);
                            toast("Review added successfully.");
                            setLoader(false);
                          }}
                        >
                          <ClipLoader
                            color={"white"}
                            loading={loader}
                            size={16}
                            aria-label="Loading Spinner"
                            data-testid="loader"
                          />
                          {!loader && "Add review"}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
  };
};
export default connect(mapStateToProps, { updateSingleProductRedux })(
  ShopDetailsTab
);
