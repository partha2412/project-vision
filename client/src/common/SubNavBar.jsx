import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notificationApi";
import { Megaphone } from "lucide-react";

const SubNavBar = () => {
  const [offers, setOffers] = useState([]);
  const [index, setIndex] = useState(0);

  const getNotifications = async () => {
    try {
      const data = await fetchNotifications();
      const offerNotifications = data.notifications.filter(
        (notif) => notif.type === "offers"
      );
      setOffers(offerNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    const refresh = setInterval(getNotifications, 60000);
    return () => clearInterval(refresh);
  }, []);

  // Rotate messages one by one every 4 seconds
  useEffect(() => {
    if (offers.length > 1) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % offers.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [offers]);

  if (offers.length === 0) return null;

  return (
    <div className="bg-gray-100 border-b border-gray-300 text-gray-800 text-sm md:text-base">
      <div className="flex items-center justify-center gap-2 py-2 px-4">
        <Megaphone size={18} className="text-gray-600" />
        <div className="relative h-5 overflow-hidden w-[90%] text-center">
          <div
            key={offers[index].message}
            className="absolute w-full animate-fade"
          >
            {offers[index].message}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlide {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0);
          }
          90% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .animate-fade {
          animation: fadeSlide 4s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SubNavBar;
