import {
  FaHome,
  FaCar,
  FaHeart,
  FaPiggyBank,
  FaBook,
  FaAppleAlt,
  FaWifi,
  FaPlane,
  FaUtensils,
  FaFilm,
  FaQuestion,
  FaShoppingBag,
  FaBriefcaseMedical,
} from "react-icons/fa";
import { ReactNode } from "react";

export const categories: { label: string; icon: () => ReactNode }[] = [
  {
    label: "EMI (House)",
    icon: () => <FaHome className="text-blue-500" />,
  },
  {
    label: "EMI (Car)",
    icon: () => <FaCar className="text-red-500" />,
  },
  {
    label: "Insurance",
    icon: () => <FaHeart className="text-pink-500" />,
  },
  {
    label: "SIP (Investments)",
    icon: () => <FaPiggyBank className="text-green-500" />,
  },
  {
    label: "Education",
    icon: () => <FaBook className="text-yellow-500" />,
  },
  {
    label: "Provisions",
    icon: () => <FaAppleAlt className="text-orange-500" />,
  },
  {
    label: "Internet and Mobile",
    icon: () => <FaWifi className="text-blue-400" />,
  },
  {
    label: "Travel",
    icon: () => <FaPlane className="text-indigo-500" />,
  },
  {
    label: "Dining Out (+Take Out)",
    icon: () => <FaUtensils className="text-rose-500" />,
  },
  {
    label: "Movies",
    icon: () => <FaFilm className="text-purple-500" />,
  },
  {
    label: "Miscellaneous",
    icon: () => <FaQuestion className="text-gray-400" />,
  },
  {
    label: "Shopping",
    icon: () => <FaShoppingBag className="text-pink-400" />,
  },
  {
    label: "Health & Medicines",
    icon: () => <FaBriefcaseMedical className="text-teal-500" />,
  },
];
