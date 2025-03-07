import { FaFacebookF, FaInstagram, FaPinterest, FaYoutube, FaGooglePay, FaCcMastercard } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"
import { SiPhonepe, SiPaytm, SiVisa,  } from "react-icons/si";


export const navLinks = [
    {
        label: "Home",
        route: "/"
    },
    {
        label: "Shop",
        route: "/list?cat=all-products"
    },
    {
        label: "Deals",
        route: "/deals"
    },
    {
        label: "Cart",
        route: "/cart"
    },
    {
        label: "About",
        route: "/about"
    },
    {
        label: "Contact",
        route: "/contact"
    },

]

export const navLinksMenu = [
    {
        label: "Home",
        route: "/"
    },
    {
        label: "Shop",
        route: "/list?cat=all-products"
    },
    {
        label: "Deals",
        route: "/deals"
    },
    {
        label: "Cart",
        route: "/cart"
    },
    {
        label: "Account",
        route: "/profile"
    },
    {
        label: "About",
        route: "/about"
    },
    {
        label: "Contact",
        route: "/contact"
    },
    {
        label: "Returns & Refunds",
        route: "/returns"
    },
    {
        label: "Legal & Privacy",
        route: "/legal"
    },
    {
        label: "Terms & Conditions",
        route: "/termsandconditions"
    },

]

export const slides1 = [
    {
      id: 1,
    //   title: "Summer Sale Collections",
    //   description: "Sale! Up to 50% off!",
      img: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/banner1.png?updatedAt=1741106851893",
      url: "/list?cat=all-products",
      bg: "bg-gradient-to-r from-yellow-50 to-pink-50",
    },
    {
      id: 2,
    //   title: "Winter Sale Collections",
    //   description: "Sale! Up to 50% off!",
      img: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/banner2.png?updatedAt=1741204181681",
      url: "/list?cat=new-arrivals",
      bg: "bg-gradient-to-r from-pink-50 to-blue-50",
    },
    {
      id: 3,
    //   title: "Spring Sale Collections",
    //   description: "Sale! Up to 50% off!",
      img: "https://ik.imagekit.io/5ok2lashts/US%20CARTEL/banner3.png?updatedAt=1741204181920",
      url: "/list?cat=neustar",
      bg: "bg-gradient-to-r from-blue-50 to-yellow-50",
    },
  ];

export const socialIcons = [
    {
        id: 1,
        icon: FaFacebookF,
        alt: 'facebook'
    },
    {
        id: 2,
        icon: FaInstagram,
        alt: 'instagram'
    },
    {
        id: 3,
        icon: FaYoutube,
        alt: 'youtube'
    },
    {
        id: 4,
        icon: FaPinterest,
        alt: 'facebook'
    },
    {
        id: 5,
        icon: FaXTwitter,
        alt: 'facebook'
    },
]

export const paymentIcons = [
    {
        id: 1,
        icon: FaGooglePay,
        alt: 'gpay',       
    },
    {
        id: 2,
        icon: SiPhonepe,
        alt: 'phonepe',       
    },
    {
        id: 3,
        icon: SiPaytm,
        alt: 'paytm',       
    },
    {
        id: 4,
        icon: SiVisa,
        alt: 'visa',
    },
    {
        id: 5,
        icon: FaCcMastercard,
        alt: 'mastercard',
    },
    // {
    //     id: 6,
    //     img: '/mastercard.png',
    //     alt: 'mastercard',
    //     width: 38,
    //     height: 18
    // },
]

export const footLinksCompany = [
    {
        label: "About Us",
        route: "/about"
    },
    {
        label: "Shop",
        route: "/list?cat=all-products"
    },
    {
        label: "Deals",
        route: "/deals"
    },
    {
        label: "Terms & Conditions",
        route: "/termsandconditions"
    },
    {
        label: "Contact Us",
        route: "/contact"
    },

]

export const footLinksShop = [
    {
        label: "New Arrivals",
        route: "/list?cat=new-arrivals"
    },
    {
        label: "Featured Products",
        route: "/list?cat=featured"
    },
    /* {
        label: "Accessories",
        route: "/"
    },
    {
        label: "Men",
        route: "/"
    },
    {
        label: "Women",
        route: "/"
    }, */
    {
        label: "All Collections",
        route: "/list?cat=all-products"
    },

]
export const footLinksHelp = [
    {
        label: "Customer Service",
        route: "/contact"
    },
    {
        label: "My Account",
        route: "/profile"
    },
    {
        label: "Find in Store",
        route: "/list?cat=all-products"
    },
    {
        label: "Legal & Privacy",
        route: "/legal"
    },
    {
        label: "Returns & Refunds",
        route: "/returns"
    },
    /* {
        label: "Gift Cards",
        route: "/"
    }, */

]

export const productImages = [
    {
        id: 1,
        imgUrl: "https://images.pexels.com/photos/12079147/pexels-photo-12079147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 2,
        imgUrl: "https://images.pexels.com/photos/7664122/pexels-photo-7664122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 3,
        imgUrl: "https://images.pexels.com/photos/7212788/pexels-photo-7212788.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
    {
        id: 4,
        imgUrl: "https://images.pexels.com/photos/6470599/pexels-photo-6470599.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
    },
];