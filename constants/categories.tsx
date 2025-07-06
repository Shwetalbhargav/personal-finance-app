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

export interface CategoryItem {
  label: string;
  icon: () => ReactNode;
  color: string;
}

export const categories: CategoryItem[] = [
  {
    label: "EMI (House)",
    icon: () => <FaHome className="text-blue-500" />,
    color: "#3B82F6",
  },
  {
    label: "EMI (Car)",
    icon: () => <FaCar className="text-red-500" />,
    color: "#EF4444",
  },
  {
    label: "Insurance",
    icon: () => <FaHeart className="text-pink-500" />,
    color: "#EC4899",
  },
  {
    label: "SIP (Investments)",
    icon: () => <FaPiggyBank className="text-green-500" />,
    color: "#10B981",
  },
  {
    label: "Education",
    icon: () => <FaBook className="text-yellow-500" />,
    color: "#F59E0B",
  },
  {
    label: "Provisions",
    icon: () => <FaAppleAlt className="text-orange-500" />,
    color: "#F97316",
  },
  {
    label: "Internet and Mobile",
    icon: () => <FaWifi className="text-blue-400" />,
    color: "#60A5FA",
  },
  {
    label: "Travel",
    icon: () => <FaPlane className="text-indigo-500" />,
    color: "#6366F1",
  },
  {
    label: "Dining Out (+Take Out)",
    icon: () => <FaUtensils className="text-rose-500" />,
    color: "#F43F5E",
  },
  {
    label: "Movies",
    icon: () => <FaFilm className="text-purple-500" />,
    color: "#A855F7",
  },
  {
    label: "Miscellaneous",
    icon: () => <FaQuestion className="text-gray-400" />,
    color: "#9CA3AF",
  },
  {
    label: "Shopping",
    icon: () => <FaShoppingBag className="text-pink-400" />,
    color: "#F472B6",
  },
  {
    label: "Health & Medicines",
    icon: () => <FaBriefcaseMedical className="text-teal-500" />,
    color: "#14B8A6",
  },
];

export const getCategoryMeta = (label: string) => {
  return categories.find((c) => c.label === label) || {
    label,
    icon: () => <FaQuestion className="text-gray-400" />,
    color: "#9CA3AF",
  };
};
