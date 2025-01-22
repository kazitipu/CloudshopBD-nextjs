"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LanguageSelect from "../common/LanguageSelect";
import CurrencySelect from "../common/CurrencySelect";
import emailjs from "@emailjs/browser";
import { aboutLinks, footerLinks, paymentImages } from "@/data/footerLinks";
export default function Footer1({ bgColor = "" }) {
  useEffect(() => {
    const headings = document.querySelectorAll(".footer-heading-moblie");

    const toggleOpen = (event) => {
      const parent = event.target.closest(".footer-col-block");

      parent.classList.toggle("open");
    };

    headings.forEach((heading) => {
      heading.addEventListener("click", toggleOpen);
    });

    // Clean up event listeners when the component unmounts
    return () => {
      headings.forEach((heading) => {
        heading.removeEventListener("click", toggleOpen);
      });
    };
  }, []); // Empty dependency array means this will run only once on mount

  const formRef = useRef();
  const [success, setSuccess] = useState(true);
  const [showMessage, setShowMessage] = useState(false);

  const handleShowMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 2000);
  };

  const sendMail = (e) => {
    emailjs
      .sendForm("service_noj8796", "template_fs3xchn", formRef.current, {
        publicKey: "iG4SCmR-YtJagQ4gV",
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          handleShowMessage();
          formRef.current.reset();
        } else {
          setSuccess(false);
          handleShowMessage();
        }
      });
  };

  return (
    <footer id="footer" className={`footer md-pb-70 ${bgColor}`}>
      <div className="footer-wrap">
        <div className="footer-body">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-infor">
                  <div className="footer-logo">
                    <Link href={`/`}>
                      <Image
                        alt="image"
                        src="/images/logo/cloudshopBD.png"
                        width="136"
                        height="21"
                      />
                    </Link>
                  </div>
                  <ul>
                    <li>
                      <p>For any enquiries contact us </p>
                    </li>
                    <li>
                      <p>
                        Email: <a href="#">clshopbd@gmail.com</a>
                      </p>
                    </li>
                    <li>
                      <p>
                        Phone: <a href="#">+8801707773082</a>
                      </p>
                    </li>
                  </ul>

                  <ul className="tf-social-icon d-flex gap-10">
                    <li>
                      <a
                        href="https://www.facebook.com/cloudshopbdfb"
                        className="box-icon w_34 round social-facebook social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-fb" />
                      </a>
                    </li>

                    <li>
                      <a
                        href="https://www.youtube.com/@cloudshopbd35/videos"
                        className="box-icon w_34 round social-instagram social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-youtube" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/cloud_shop_bd"
                        className="box-icon w_34 round social-instagram social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-instagram" />
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/@cloudshopbd.com"
                        className="box-icon w_34 round social-tiktok social-line"
                        target="_blank"
                      >
                        <i className="icon fs-14 icon-tiktok" />
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>Help</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>Help</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {footerLinks.map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12 footer-col-block">
                <div className="footer-heading footer-heading-desktop">
                  <h6>About us</h6>
                </div>
                <div className="footer-heading footer-heading-moblie">
                  <h6>About us</h6>
                </div>
                <ul className="footer-menu-list tf-collapse-content">
                  {aboutLinks.slice(0, 4).map((link, index) => (
                    <li key={index}>
                      <Link href={link.href} className="footer-menu_item">
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-xl-3 col-md-6 col-12">
                <div className="footer-newsletter footer-col-block">
                  <div className="footer-heading footer-heading-desktop">
                    <h6>Download App</h6>
                  </div>
                  <div className="footer-heading footer-heading-moblie">
                    <h6>Download App</h6>
                  </div>
                  <div className="tf-collapse-content">
                    <div className="footer-menu_item">
                      <div>
                        <a
                          href="https://play.google.com/store/apps/details?id=com.cloudshopbd&hl=en"
                          target="_blank"
                        >
                          <img
                            src="/images/blog/googlePlay.png"
                            style={{ width: "50%" }}
                          />
                        </a>
                      </div>
                      <div>
                        <a
                          href="https://apps.apple.com/us/app/cloudshopbd/id6479618431"
                          target="_blank"
                        >
                          <img
                            src="/images/blog/appStore.png"
                            style={{ width: "50%" }}
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="footer-bottom-wrap d-flex gap-20 flex-wrap justify-content-between align-items-center">
                  <div className="footer-menu_item">
                    © {new Date().getFullYear()} CloudshopBD.com All Rights
                    Reserved
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
