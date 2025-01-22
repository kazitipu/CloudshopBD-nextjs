"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { connect } from "react-redux";
const accountLinks = [
  { href: "/my-account", label: "Dashboard" },
  { href: "/my-account-orders", label: "Orders" },
  { href: "/my-account-address", label: "Addresses" },
  { href: "/my-account-edit", label: "Account Details" },
  { href: "/my-account-wishlist", label: "Wishlist" },
];

const DashboardNav = ({ currentUser }) => {
  const pathname = usePathname();
  return (
    <ul className="my-account-nav">
      {accountLinks.map((link, index) => (
        <li key={index}>
          <Link
            href={link.href}
            className={`my-account-nav-item ${
              pathname == link.href ? "active" : ""
            }`}
          >
            {link.label}
          </Link>
        </li>
      ))}
      {currentUser && currentUser.uid ? (
        <li>
          <Link href={`/login`} className="my-account-nav-item">
            Logout
          </Link>
        </li>
      ) : null}
    </ul>
  );
};
const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
  };
};
export default connect(mapStateToProps, {})(DashboardNav);
