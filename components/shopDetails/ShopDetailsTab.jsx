"use client";

import { useEffect, useState } from "react";

const tabs = [
  { title: "Description", active: true },
  { title: "Reviews", active: false },
  { title: "Add Review", active: false },
];

export default function ShopDetailsTab({ product }) {
  const [currentTab, setCurrentTab] = useState(1);

  return (
    <section
      className="flat-spacing-17 pt_0"
      style={{ maxWidth: "100vw", overflow: "clip" }}
    >
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="widget-tabs style-has-border">
              <ul className="widget-menu-tab">
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
                      product.reviews.map((review) => (
                        <div style={{ marginBottom: 40 }}>
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
                  <div className="tf-page-privacy-policy">
                    <div className="title">
                      The Company Private Limited Policy
                    </div>
                    <p>
                      The Company Private Limited and each of their respective
                      subsidiary, parent and affiliated companies is deemed to
                      operate this Website (“we” or “us”) recognizes that you
                      care how information about you is used and shared. We have
                      created this Privacy Policy to inform you what information
                      we collect on the Website, how we use your information and
                      the choices you have about the way your information is
                      collected and used. Please read this Privacy Policy
                      carefully. Your use of the Website indicates that you have
                      read and accepted our privacy practices, as outlined in
                      this Privacy Policy.
                    </p>
                    <p>
                      Please be advised that the practices described in this
                      Privacy Policy apply to information gathered by us or our
                      subsidiaries, affiliates or agents: (i) through this
                      Website, (ii) where applicable, through our Customer
                      Service Department in connection with this Website, (iii)
                      through information provided to us in our free standing
                      retail stores, and (iv) through information provided to us
                      in conjunction with marketing promotions and sweepstakes.
                    </p>
                    <p>
                      We are not responsible for the content or privacy
                      practices on any websites.
                    </p>
                    <p>
                      We reserve the right, in our sole discretion, to modify,
                      update, add to, discontinue, remove or otherwise change
                      any portion of this Privacy Policy, in whole or in part,
                      at any time. When we amend this Privacy Policy, we will
                      revise the “last updated” date located at the top of this
                      Privacy Policy.
                    </p>
                    <p>
                      If you provide information to us or access or use the
                      Website in any way after this Privacy Policy has been
                      changed, you will be deemed to have unconditionally
                      consented and agreed to such changes. The most current
                      version of this Privacy Policy will be available on the
                      Website and will supersede all previous versions of this
                      Privacy Policy.
                    </p>
                    <p>
                      If you have any questions regarding this Privacy Policy,
                      you should contact our Customer Service Department by
                      email at marketing@company.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
