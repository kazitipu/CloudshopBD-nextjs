"use client";
import { useContextElement } from "@/context/Context";
import Image from "next/image";
import Link from "next/link";
import { connect } from "react-redux";
import React, { useState, useEffect } from "react";
import { matchCoupon } from "@/firebase/firebase.utils";
import {
  setCouponRedux,
  setTotalRedux,
  updateSingleProductRedux,
  addToOrderRedux,
} from "@/actions";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
const Checkout = ({
  cartData,
  setCouponRedux,
  currentUser,
  freeShipping,
  setTotalRedux,
  guest,
  addToOrderRedux,
  updateSingleProductRedux,
}) => {
  const [number, onChangeNumber] = React.useState("");
  const [loader, setLoader] = useState(false);
  const [showCoupon, setShowCoupon] = React.useState(false);
  const [coupon, setCoupon] = React.useState(null);
  const [dhakaDelivery, setDhakaDelivery] = React.useState(true);
  const [state, setState] = useState({
    loading: true,
    cartArr: [],
    cartProducts: [],
    sumAmount: 0,
    actualOrder: 0,
    isApplied: false,
    validCode: false,
    couponCode: null,
    dhakaDelivery: true,
  });
  useEffect(() => {
    calculateCart();
  }, [cartData]);

  const calculateCart = () => {
    let cartProducts = cartData;
    let sumAmount = 0;
    let actualOrder = 0;

    //find and create array
    cartProducts &&
      cartProducts.length > 0 &&
      cartProducts.forEach(function (item, index) {
        let price = getPrice2(item);
        let actualPrice = getPrice3(item);
        sumAmount += parseInt(price) * item.quantity;
        actualOrder += parseInt(actualPrice) * item.quantity;
      });

    setState({
      ...state,
      loading: false,
      cartProducts: cartProducts,
      sumAmount: sumAmount,
      actualOrder: actualOrder,
    });
    // props.setTotalRedux(sumAmount);
  };

  const singleProductTotal = (product) => {
    let total = parseInt(getPrice4(product)) * product.quantity;
    return total;
  };
  const singleProductTotal2 = (product) => {
    let total = parseInt(getPrice3(product)) * product.quantity;
    return total;
  };

  const getPrice2 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return product.selectedVariation.price;
      } else {
        return product.selectedVariation.salePrice;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return product.product.price;
        } else {
          return product.product.salePrice;
        }
      } else {
        return 0;
      }
    }
  };

  const getPrice3 = (product) => {
    if (product.selectedVariation.id) {
      return product.selectedVariation.price;
    } else {
      if (product.product) {
        return product.product.price;
      } else {
        return 0;
      }
    }
  };

  const getPrice4 = (product) => {
    if (product.selectedVariation.id) {
      if (product.selectedVariation.salePrice == 0) {
        return product.selectedVariation.price;
      } else {
        return product.selectedVariation.salePrice;
      }
    } else {
      if (product.product) {
        if (product.product.salePrice == 0) {
          return product.product.price;
        } else {
          return product.product.salePrice;
        }
      } else {
        return 0;
      }
    }
  };

  const getTotal = (sumAmount) => {
    let total = 0;
    let deliveryCharge = 0;
    if (dhakaDelivery) {
      deliveryCharge = 70;
    } else {
      deliveryCharge = 120;
    }
    if (coupon) {
      if (sumAmount < freeShipping) {
        total =
          coupon.discountType == "cash"
            ? sumAmount + deliveryCharge - coupon.discountAmount
            : sumAmount +
              deliveryCharge -
              parseInt(sumAmount * (coupon.discountAmount / 100));
        setTotalRedux(total);
        return total;
      } else {
        total =
          coupon.discountType == "cash"
            ? sumAmount - coupon.discountAmount
            : sumAmount - parseInt(sumAmount * (coupon.discountAmount / 100));
        setTotalRedux(total);
        return total;
      }
    } else {
      if (sumAmount < freeShipping) {
        total = sumAmount + deliveryCharge;
        setTotalRedux(total);
        return total;
      } else {
        total = sumAmount;
        setTotalRedux(total);
        return total;
      }
    }
  };

  let shippingAddress = null;
  if (currentUser && currentUser.address && currentUser.address.length > 0) {
    shippingAddress = currentUser.address.find((addr) => addr.defaultShipping);
  } else if (guest && guest.address && guest.address.length > 0) {
    shippingAddress = guest.address.find((addr) => addr.defaultShipping);
  }

  return (
    <section className="flat-spacing-11">
      <div className="container">
        <div className="tf-page-cart-wrap layout-2">
          <div className="tf-page-cart-item">
            <h5 className="fw-5 mb_20">Delivery Address</h5>
            <form className="form-checkout">
              <div className="box grid-2">
                <fieldset className="fieldset">
                  <label htmlFor="first-name">First Name</label>
                  <input
                    required
                    type="text"
                    id="first-name"
                    placeholder="Themesflat"
                  />
                </fieldset>
                <fieldset className="fieldset">
                  <label htmlFor="last-name">Last Name</label>
                  <input required type="text" id="last-name" />
                </fieldset>
              </div>
              <fieldset className="box fieldset">
                <label htmlFor="country">Country/Region</label>
                <div className="select-custom">
                  <select
                    required
                    className="tf-select w-100"
                    id="country"
                    name="address[country]"
                    data-default=""
                  >
                    <option value="---" data-provinces="[]">
                      ---
                    </option>
                    <option
                      value="Australia"
                      data-provinces="[['Australian Capital Territory','Australian Capital Territory'],['New South Wales','New South Wales'],['Northern Territory','Northern Territory'],['Queensland','Queensland'],['South Australia','South Australia'],['Tasmania','Tasmania'],['Victoria','Victoria'],['Western Australia','Western Australia']]"
                    >
                      Australia
                    </option>
                    <option value="Austria" data-provinces="[]">
                      Austria
                    </option>
                    <option value="Belgium" data-provinces="[]">
                      Belgium
                    </option>
                    <option
                      value="Canada"
                      data-provinces="[['Alberta','Alberta'],['British Columbia','British Columbia'],['Manitoba','Manitoba'],['New Brunswick','New Brunswick'],['Newfoundland and Labrador','Newfoundland and Labrador'],['Northwest Territories','Northwest Territories'],['Nova Scotia','Nova Scotia'],['Nunavut','Nunavut'],['Ontario','Ontario'],['Prince Edward Island','Prince Edward Island'],['Quebec','Quebec'],['Saskatchewan','Saskatchewan'],['Yukon','Yukon']]"
                    >
                      Canada
                    </option>
                    <option value="Czech Republic" data-provinces="[]">
                      Czechia
                    </option>
                    <option value="Denmark" data-provinces="[]">
                      Denmark
                    </option>
                    <option value="Finland" data-provinces="[]">
                      Finland
                    </option>
                    <option value="France" data-provinces="[]">
                      France
                    </option>
                    <option value="Germany" data-provinces="[]">
                      Germany
                    </option>
                    <option
                      value="Hong Kong"
                      data-provinces="[['Hong Kong Island','Hong Kong Island'],['Kowloon','Kowloon'],['New Territories','New Territories']]"
                    >
                      Hong Kong SAR
                    </option>
                    <option
                      value="Ireland"
                      data-provinces="[['Carlow','Carlow'],['Cavan','Cavan'],['Clare','Clare'],['Cork','Cork'],['Donegal','Donegal'],['Dublin','Dublin'],['Galway','Galway'],['Kerry','Kerry'],['Kildare','Kildare'],['Kilkenny','Kilkenny'],['Laois','Laois'],['Leitrim','Leitrim'],['Limerick','Limerick'],['Longford','Longford'],['Louth','Louth'],['Mayo','Mayo'],['Meath','Meath'],['Monaghan','Monaghan'],['Offaly','Offaly'],['Roscommon','Roscommon'],['Sligo','Sligo'],['Tipperary','Tipperary'],['Waterford','Waterford'],['Westmeath','Westmeath'],['Wexford','Wexford'],['Wicklow','Wicklow']]"
                    >
                      Ireland
                    </option>
                    <option value="Israel" data-provinces="[]">
                      Israel
                    </option>
                    <option
                      value="Italy"
                      data-provinces="[['Agrigento','Agrigento'],['Alessandria','Alessandria'],['Ancona','Ancona'],['Aosta','Aosta Valley'],['Arezzo','Arezzo'],['Ascoli Piceno','Ascoli Piceno'],['Asti','Asti'],['Avellino','Avellino'],['Bari','Bari'],['Barletta-Andria-Trani','Barletta-Andria-Trani'],['Belluno','Belluno'],['Benevento','Benevento'],['Bergamo','Bergamo'],['Biella','Biella'],['Bologna','Bologna'],['Bolzano','South Tyrol'],['Brescia','Brescia'],['Brindisi','Brindisi'],['Cagliari','Cagliari'],['Caltanissetta','Caltanissetta'],['Campobasso','Campobasso'],['Carbonia-Iglesias','Carbonia-Iglesias'],['Caserta','Caserta'],['Catania','Catania'],['Catanzaro','Catanzaro'],['Chieti','Chieti'],['Como','Como'],['Cosenza','Cosenza'],['Cremona','Cremona'],['Crotone','Crotone'],['Cuneo','Cuneo'],['Enna','Enna'],['Fermo','Fermo'],['Ferrara','Ferrara'],['Firenze','Florence'],['Foggia','Foggia'],['Forlì-Cesena','Forlì-Cesena'],['Frosinone','Frosinone'],['Genova','Genoa'],['Gorizia','Gorizia'],['Grosseto','Grosseto'],['Imperia','Imperia'],['Isernia','Isernia'],['L'Aquila','L’Aquila'],['La Spezia','La Spezia'],['Latina','Latina'],['Lecce','Lecce'],['Lecco','Lecco'],['Livorno','Livorno'],['Lodi','Lodi'],['Lucca','Lucca'],['Macerata','Macerata'],['Mantova','Mantua'],['Massa-Carrara','Massa and Carrara'],['Matera','Matera'],['Medio Campidano','Medio Campidano'],['Messina','Messina'],['Milano','Milan'],['Modena','Modena'],['Monza e Brianza','Monza and Brianza'],['Napoli','Naples'],['Novara','Novara'],['Nuoro','Nuoro'],['Ogliastra','Ogliastra'],['Olbia-Tempio','Olbia-Tempio'],['Oristano','Oristano'],['Padova','Padua'],['Palermo','Palermo'],['Parma','Parma'],['Pavia','Pavia'],['Perugia','Perugia'],['Pesaro e Urbino','Pesaro and Urbino'],['Pescara','Pescara'],['Piacenza','Piacenza'],['Pisa','Pisa'],['Pistoia','Pistoia'],['Pordenone','Pordenone'],['Potenza','Potenza'],['Prato','Prato'],['Ragusa','Ragusa'],['Ravenna','Ravenna'],['Reggio Calabria','Reggio Calabria'],['Reggio Emilia','Reggio Emilia'],['Rieti','Rieti'],['Rimini','Rimini'],['Roma','Rome'],['Rovigo','Rovigo'],['Salerno','Salerno'],['Sassari','Sassari'],['Savona','Savona'],['Siena','Siena'],['Siracusa','Syracuse'],['Sondrio','Sondrio'],['Taranto','Taranto'],['Teramo','Teramo'],['Terni','Terni'],['Torino','Turin'],['Trapani','Trapani'],['Trento','Trentino'],['Treviso','Treviso'],['Trieste','Trieste'],['Udine','Udine'],['Varese','Varese'],['Venezia','Venice'],['Verbano-Cusio-Ossola','Verbano-Cusio-Ossola'],['Vercelli','Vercelli'],['Verona','Verona'],['Vibo Valentia','Vibo Valentia'],['Vicenza','Vicenza'],['Viterbo','Viterbo']]"
                    >
                      Italy
                    </option>
                    <option
                      value="Japan"
                      data-provinces="[['Aichi','Aichi'],['Akita','Akita'],['Aomori','Aomori'],['Chiba','Chiba'],['Ehime','Ehime'],['Fukui','Fukui'],['Fukuoka','Fukuoka'],['Fukushima','Fukushima'],['Gifu','Gifu'],['Gunma','Gunma'],['Hiroshima','Hiroshima'],['Hokkaidō','Hokkaido'],['Hyōgo','Hyogo'],['Ibaraki','Ibaraki'],['Ishikawa','Ishikawa'],['Iwate','Iwate'],['Kagawa','Kagawa'],['Kagoshima','Kagoshima'],['Kanagawa','Kanagawa'],['Kumamoto','Kumamoto'],['Kyōto','Kyoto'],['Kōchi','Kochi'],['Mie','Mie'],['Miyagi','Miyagi'],['Miyazaki','Miyazaki'],['Nagano','Nagano'],['Nagasaki','Nagasaki'],['Nara','Nara'],['Niigata','Niigata'],['Okayama','Okayama'],['Okinawa','Okinawa'],['Saga','Saga'],['Saitama','Saitama'],['Shiga','Shiga'],['Shimane','Shimane'],['Shizuoka','Shizuoka'],['Tochigi','Tochigi'],['Tokushima','Tokushima'],['Tottori','Tottori'],['Toyama','Toyama'],['Tōkyō','Tokyo'],['Wakayama','Wakayama'],['Yamagata','Yamagata'],['Yamaguchi','Yamaguchi'],['Yamanashi','Yamanashi'],['Ōita','Oita'],['Ōsaka','Osaka']]"
                    >
                      Japan
                    </option>
                    <option
                      value="Malaysia"
                      data-provinces="[['Johor','Johor'],['Kedah','Kedah'],['Kelantan','Kelantan'],['Kuala Lumpur','Kuala Lumpur'],['Labuan','Labuan'],['Melaka','Malacca'],['Negeri Sembilan','Negeri Sembilan'],['Pahang','Pahang'],['Penang','Penang'],['Perak','Perak'],['Perlis','Perlis'],['Putrajaya','Putrajaya'],['Sabah','Sabah'],['Sarawak','Sarawak'],['Selangor','Selangor'],['Terengganu','Terengganu']]"
                    >
                      Malaysia
                    </option>
                    <option value="Netherlands" data-provinces="[]">
                      Netherlands
                    </option>
                    <option
                      value="New Zealand"
                      data-provinces="[['Auckland','Auckland'],['Bay of Plenty','Bay of Plenty'],['Canterbury','Canterbury'],['Chatham Islands','Chatham Islands'],['Gisborne','Gisborne'],['Hawke's Bay','Hawke’s Bay'],['Manawatu-Wanganui','Manawatū-Whanganui'],['Marlborough','Marlborough'],['Nelson','Nelson'],['Northland','Northland'],['Otago','Otago'],['Southland','Southland'],['Taranaki','Taranaki'],['Tasman','Tasman'],['Waikato','Waikato'],['Wellington','Wellington'],['West Coast','West Coast']]"
                    >
                      New Zealand
                    </option>
                    <option value="Norway" data-provinces="[]">
                      Norway
                    </option>
                    <option value="Poland" data-provinces="[]">
                      Poland
                    </option>
                    <option
                      value="Portugal"
                      data-provinces="[['Aveiro','Aveiro'],['Açores','Azores'],['Beja','Beja'],['Braga','Braga'],['Bragança','Bragança'],['Castelo Branco','Castelo Branco'],['Coimbra','Coimbra'],['Faro','Faro'],['Guarda','Guarda'],['Leiria','Leiria'],['Lisboa','Lisbon'],['Madeira','Madeira'],['Portalegre','Portalegre'],['Porto','Porto'],['Santarém','Santarém'],['Setúbal','Setúbal'],['Viana do Castelo','Viana do Castelo'],['Vila Real','Vila Real'],['Viseu','Viseu'],['Évora','Évora']]"
                    >
                      Portugal
                    </option>
                    <option value="Singapore" data-provinces="[]">
                      Singapore
                    </option>
                    <option
                      value="South Korea"
                      data-provinces="[['Busan','Busan'],['Chungbuk','North Chungcheong'],['Chungnam','South Chungcheong'],['Daegu','Daegu'],['Daejeon','Daejeon'],['Gangwon','Gangwon'],['Gwangju','Gwangju City'],['Gyeongbuk','North Gyeongsang'],['Gyeonggi','Gyeonggi'],['Gyeongnam','South Gyeongsang'],['Incheon','Incheon'],['Jeju','Jeju'],['Jeonbuk','North Jeolla'],['Jeonnam','South Jeolla'],['Sejong','Sejong'],['Seoul','Seoul'],['Ulsan','Ulsan']]"
                    >
                      South Korea
                    </option>
                    <option
                      value="Spain"
                      data-provinces="[['A Coruña','A Coruña'],['Albacete','Albacete'],['Alicante','Alicante'],['Almería','Almería'],['Asturias','Asturias Province'],['Badajoz','Badajoz'],['Balears','Balears Province'],['Barcelona','Barcelona'],['Burgos','Burgos'],['Cantabria','Cantabria Province'],['Castellón','Castellón'],['Ceuta','Ceuta'],['Ciudad Real','Ciudad Real'],['Cuenca','Cuenca'],['Cáceres','Cáceres'],['Cádiz','Cádiz'],['Córdoba','Córdoba'],['Girona','Girona'],['Granada','Granada'],['Guadalajara','Guadalajara'],['Guipúzcoa','Gipuzkoa'],['Huelva','Huelva'],['Huesca','Huesca'],['Jaén','Jaén'],['La Rioja','La Rioja Province'],['Las Palmas','Las Palmas'],['León','León'],['Lleida','Lleida'],['Lugo','Lugo'],['Madrid','Madrid Province'],['Melilla','Melilla'],['Murcia','Murcia'],['Málaga','Málaga'],['Navarra','Navarra'],['Ourense','Ourense'],['Palencia','Palencia'],['Pontevedra','Pontevedra'],['Salamanca','Salamanca'],['Santa Cruz de Tenerife','Santa Cruz de Tenerife'],['Segovia','Segovia'],['Sevilla','Seville'],['Soria','Soria'],['Tarragona','Tarragona'],['Teruel','Teruel'],['Toledo','Toledo'],['Valencia','Valencia'],['Valladolid','Valladolid'],['Vizcaya','Biscay'],['Zamora','Zamora'],['Zaragoza','Zaragoza'],['Álava','Álava'],['Ávila','Ávila']]"
                    >
                      Spain
                    </option>
                    <option value="Sweden" data-provinces="[]">
                      Sweden
                    </option>
                    <option value="Switzerland" data-provinces="[]">
                      Switzerland
                    </option>
                    <option
                      value="United Arab Emirates"
                      data-provinces="[['Abu Dhabi','Abu Dhabi'],['Ajman','Ajman'],['Dubai','Dubai'],['Fujairah','Fujairah'],['Ras al-Khaimah','Ras al-Khaimah'],['Sharjah','Sharjah'],['Umm al-Quwain','Umm al-Quwain']]"
                    >
                      United Arab Emirates
                    </option>
                    <option
                      value="United Kingdom"
                      data-provinces="[['British Forces','British Forces'],['England','England'],['Northern Ireland','Northern Ireland'],['Scotland','Scotland'],['Wales','Wales']]"
                    >
                      United Kingdom
                    </option>
                    <option
                      value="United States"
                      data-provinces="[['Alabama','Alabama'],['Alaska','Alaska'],['American Samoa','American Samoa'],['Arizona','Arizona'],['Arkansas','Arkansas'],['Armed Forces Americas','Armed Forces Americas'],['Armed Forces Europe','Armed Forces Europe'],['Armed Forces Pacific','Armed Forces Pacific'],['California','California'],['Colorado','Colorado'],['Connecticut','Connecticut'],['Delaware','Delaware'],['District of Columbia','Washington DC'],['Federated States of Micronesia','Micronesia'],['Florida','Florida'],['Georgia','Georgia'],['Guam','Guam'],['Hawaii','Hawaii'],['Idaho','Idaho'],['Illinois','Illinois'],['Indiana','Indiana'],['Iowa','Iowa'],['Kansas','Kansas'],['Kentucky','Kentucky'],['Louisiana','Louisiana'],['Maine','Maine'],['Marshall Islands','Marshall Islands'],['Maryland','Maryland'],['Massachusetts','Massachusetts'],['Michigan','Michigan'],['Minnesota','Minnesota'],['Mississippi','Mississippi'],['Missouri','Missouri'],['Montana','Montana'],['Nebraska','Nebraska'],['Nevada','Nevada'],['New Hampshire','New Hampshire'],['New Jersey','New Jersey'],['New Mexico','New Mexico'],['New York','New York'],['North Carolina','North Carolina'],['North Dakota','North Dakota'],['Northern Mariana Islands','Northern Mariana Islands'],['Ohio','Ohio'],['Oklahoma','Oklahoma'],['Oregon','Oregon'],['Palau','Palau'],['Pennsylvania','Pennsylvania'],['Puerto Rico','Puerto Rico'],['Rhode Island','Rhode Island'],['South Carolina','South Carolina'],['South Dakota','South Dakota'],['Tennessee','Tennessee'],['Texas','Texas'],['Utah','Utah'],['Vermont','Vermont'],['Virgin Islands','U.S. Virgin Islands'],['Virginia','Virginia'],['Washington','Washington'],['West Virginia','West Virginia'],['Wisconsin','Wisconsin'],['Wyoming','Wyoming']]"
                    >
                      United States
                    </option>
                    <option value="Vietnam" data-provinces="[]">
                      Vietnam
                    </option>
                  </select>
                </div>
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="city">Town/City</label>
                <input required type="text" id="city" />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="address">Address</label>
                <input required type="text" id="address" />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="phone">Phone Number</label>
                <input required type="number" id="phone" />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="email">Email</label>
                <input
                  required
                  type="email"
                  autoComplete="abc@xyz.com"
                  id="email"
                />
              </fieldset>
              <fieldset className="box fieldset">
                <label htmlFor="note">Order notes (optional)</label>
                <textarea name="note" id="note" defaultValue={""} />
              </fieldset>
            </form>
          </div>
          <div className="tf-page-cart-footer">
            <div className="tf-cart-footer-inner">
              <h5 className="fw-5 mb_20">Your order</h5>
              <form className="tf-page-cart-checkout widget-wrap-checkout">
                <ul className="wrap-checkout-product">
                  {cartData.map((item, i) => (
                    <li key={i} className="checkout-product-item">
                      <figure className="img-product">
                        <Image
                          alt="product"
                          src={
                            item.selectedVariation &&
                            item.selectedVariation.id &&
                            item.selectedVariation.pictures &&
                            item.selectedVariation.pictures.length > 0
                              ? item.selectedVariation.pictures[0]
                              : item.product.pictures[0]
                          }
                          width={720}
                          height={1005}
                          style={{ objectFit: "cover", borderRadius: 5 }}
                        />
                        <span className="quantity">{item.quantity}</span>
                      </figure>
                      <div className="content">
                        <div className="info">
                          <p
                            className="name"
                            style={{ maxWidth: "80%", minWidth: "80%" }}
                          >
                            {item.product.name.slice(0, 40)}
                          </p>
                          <span className="variant">
                            {" "}
                            {item.selectedVariation &&
                              item.selectedVariation.id &&
                              item.selectedVariation.combination.map(
                                (comb, index) => (
                                  <div key={index} style={{ marginTop: -5 }}>
                                    {item.product.savedAttributes.find(
                                      (attr) => attr.id == comb.parentId
                                    )
                                      ? item.product.savedAttributes.find(
                                          (attr) => attr.id == comb.parentId
                                        ).name
                                      : ""}
                                    :{" "}
                                    <span style={{ fontWeight: "bold" }}>
                                      {comb.name}
                                    </span>
                                  </div>
                                )
                              )}
                          </span>
                        </div>
                        <span className="price" style={{ fontWeight: "bold" }}>
                          ৳{singleProductTotal(item)} <br />
                          <span
                            style={{
                              fontWeight: "lighter",
                              fontSize: 11,
                              textDecoration: "line-through",
                              marginLeft: 5,
                            }}
                          >
                            ৳{singleProductTotal2(item)}
                          </span>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                {cartData.length == 0 && (
                  <div className="container">
                    <div className="row align-items-center mt-5 mb-5">
                      <div className="col-12 fs-18">
                        Your shop cart is empty
                      </div>
                      <div className="col-12 mt-3">
                        <Link
                          href={`/shop-default`}
                          className="tf-btn btn-fill animate-hover-btn radius-3 w-100 justify-content-center"
                          style={{ width: "fit-content" }}
                        >
                          Explore Products!
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                <div className="coupon-box">
                  <input
                    required
                    type="text"
                    placeholder="Enter coupon code"
                    onChange={(e) => {
                      onChangeNumber(e.target.value);
                    }}
                    value={number}
                  />
                  <div
                    className="tf-btn btn-sm radius-3 btn-fill btn-icon animate-hover-btn"
                    onClick={async () => {
                      let matchedCoupon = await matchCoupon(number);

                      if (matchedCoupon) {
                        if (
                          Date.parse(matchedCoupon.expirationDate) <
                          Date.parse(new Date().toDateString())
                        ) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `${number} Coupon code was expired at ${matchedCoupon.expirationDate}`
                          );
                          return;
                        }
                        if (
                          currentUser &&
                          currentUser.coupons &&
                          currentUser.coupons.length > 0 &&
                          currentUser.coupons.find(
                            (coupon) => coupon.id == matchedCoupon.id
                          ) &&
                          currentUser.coupons.find(
                            (coupon) => coupon.id == matchedCoupon.id
                          ).usageLimit >= matchedCoupon.usageLimit
                        ) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `you've reaced the maximum usage limit of coupon ${number}.`
                          );
                          return;
                        }
                        if (matchedCoupon.minimumOrder > state.sumAmount) {
                          setCouponRedux(null);
                          setCoupon(null);
                          toast(
                            `Please Order at least ${matchedCoupon.minimumOrder}Tk to use this Coupon ${number} `
                          );
                        }

                        setCouponRedux(matchedCoupon);
                        setCoupon(matchedCoupon);
                        toast(
                          `Coupon code ${number} has been applied to your order.`
                        );
                        return;
                      } else {
                        setCouponRedux(null);
                        setCoupon(null);
                        toast(`${number} is not a valid coupon code.`);
                        return;
                      }
                    }}
                  >
                    Apply
                  </div>
                </div>
                <div
                  className="d-flex"
                  style={{ color: "#ff8084", fontWeight: "bold", fontSize: 15 }}
                >
                  You are saving ৳ {state.actualOrder - state.sumAmount} in this
                  order.{" "}
                </div>
                <div className="d-flex">
                  <img
                    src="/images/logo/cashonDelivery.png"
                    style={{ height: 100, width: 100 }}
                  />
                  <div
                    style={{
                      alignSelf: "center",
                      color: "white",
                      background: "#1b5cce",
                      fontWeight: "bold",
                      padding: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      borderRadius: 5,
                      width: "100%",
                    }}
                  >
                    Cash on delivery
                  </div>
                </div>

                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Subtotal</h6>
                  <h6 className="total fw-5">৳ {state.actualOrder}</h6>
                </div>
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Discount applied</h6>
                  <h6 className="total fw-5">
                    {" "}
                    -৳ {state.actualOrder - state.sumAmount}
                  </h6>
                </div>
                {coupon && (
                  <div className="d-flex justify-content-between line pb_20">
                    <h6 className="fw-5">
                      Coupon applied{" "}
                      <span style={{ color: "#ff8084" }}>({coupon.name})</span>
                    </h6>
                    <h6 className="total fw-5">
                      {" "}
                      -৳{" "}
                      {coupon.discountType == "cash"
                        ? coupon.discountAmount
                        : parseInt(
                            state.sumAmount * (coupon.discountAmount / 100)
                          )}
                    </h6>
                  </div>
                )}
                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5">Regular Delivery</h6>
                  <h6 className="total fw-5">
                    {state.sumAmount > freeShipping
                      ? "Free"
                      : dhakaDelivery
                      ? "৳ 70"
                      : "৳ 120"}
                  </h6>
                </div>

                <div className="wd-check-payment">
                  <div className="fieldset-radio" style={{ marginBottom: 5 }}>
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="delivery"
                      className="tf-check"
                      checked={dhakaDelivery}
                      onChange={(e) => {
                        setDhakaDelivery(true);
                      }}
                    />
                    <label htmlFor="delivery">
                      12-48 hours delivery (Inside Dhaka) -{" "}
                      <span style={{ fontWeight: "bold" }}>৳ 70 </span>
                    </label>
                  </div>
                  <div className="fieldset-radio">
                    <input
                      required
                      type="radio"
                      name="payment"
                      id="delivery"
                      className="tf-check"
                      checked={!dhakaDelivery}
                      onChange={(e) => {
                        setDhakaDelivery(false);
                      }}
                    />
                    <label htmlFor="delivery">
                      1-5 days delivery (Outside Dhaka) -{" "}
                      <span style={{ fontWeight: "bold" }}>৳ 120 </span>
                    </label>
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      padding: 10,
                      paddingTop: 2,
                      paddingBottom: 2,
                      backgroundColor: "cadetblue",
                      borderRadius: 5,
                      color: "white",
                      alignSelf: "flex-start",
                      display: "inline",
                    }}
                  >
                    ! Order above ৳ {freeShipping} to get free delivery.
                  </div>
                </div>

                <div className="d-flex justify-content-between line pb_20">
                  <h6 className="fw-5"> Amount Payable</h6>
                  <h6 className="total fw-5">৳ {getTotal(state.sumAmount)}</h6>
                </div>
                <div className="wd-check-payment">
                  <div className="fieldset-radio mb_20"></div>

                  <div className="box-checkbox fieldset-radio mb_20">
                    <input
                      required
                      type="checkbox"
                      id="check-agree"
                      className="tf-check"
                    />
                    <label htmlFor="check-agree" className="text_black-2">
                      I have read and agree to the website
                      <Link
                        href={`/terms-conditions`}
                        className="text-decoration-underline"
                      >
                        {" "}
                        terms and conditions
                      </Link>
                      .
                    </label>
                  </div>
                </div>
                <button
                  className="tf-btn radius-3 btn-fill btn-icon animate-hover-btn justify-content-center"
                  onClick={async () => {
                    if (!shippingAddress) {
                      toast(
                        "You must add/choose a shipping address to place order."
                      );
                      return;
                    }
                    setLoader(true);
                    let orderObj = {
                      id:
                        new Date().getTime().toString() + currentUser &&
                        currentUser.uid
                          ? currentUser.uid.slice(0, 3)
                          : guest.id.slice(0, 3),
                      currentUser: currentUser,
                      guest: guest && guest.id ? guest : false,
                      orders: cartData,
                      subTotal: state.actualOrder,
                      deliveryCharge:
                        state.sumAmount >= freeShipping
                          ? 0
                          : dhakaDelivery
                          ? 70
                          : 120,
                      discountApplied: state.actualOrder - state.sumAmount,
                      couponApplied: coupon
                        ? {
                            name: coupon.name,
                            discount:
                              coupon.discountType == "cash"
                                ? coupon.discountAmount
                                : parseInt(
                                    state.sumAmount *
                                      (coupon.discountAmount / 100)
                                  ),
                          }
                        : null,
                      orderStatus: "Processing",
                      date: new Date().getTime().toString(),
                      orderStatusScore: 1,
                      userId:
                        currentUser && currentUser.uid
                          ? currentUser.uid
                          : guest.id,
                    };
                    await addToOrderRedux(orderObj);
                    for (let i = 0; i < orderObj.orders.length; i++) {
                      await updateSingleProductRedux({
                        ...orderObj.orders[i].product,
                        totalSold: orderObj.orders[i].product.totalSold
                          ? orderObj.orders[i].product.totalSold +
                            parseInt(orderObj.orders[i].quantity)
                          : parseInt(orderObj.orders[i].quantity),
                      });
                    }
                    setLoader(false);
                  }}
                >
                  {loader ? (
                    <ClipLoader loading={loader} size={19} color="white" />
                  ) : (
                    "Place Order"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => {
  return {
    cartData: state.cart.cartData,
    coupon: state.cart.coupon,
    currentUser: state.users.currentUser,
    freeShipping: state.cart.freeShipping,
    total: state.cart.total,
    guest: state.users.guest,
  };
};
export default connect(mapStateToProps, {
  setCouponRedux,
  setTotalRedux,
  addToOrderRedux,
  updateSingleProductRedux,
})(Checkout);
