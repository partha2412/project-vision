import React, { useEffect, useState } from "react";
import { fetchNotifications } from "../api/notificationApi";

const SubNavBar = () => {
  const [offers, setOffers] = useState([]);

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

  if (offers.length === 0) return null;

  // Duplicate offers for seamless infinite loop
  const scrollingOffers = [...offers, ...offers];

  return (
    <div className="relative overflow-hidden bg-blue-100 text-blue-800 py-2">
      <div className="scroll-wrapper">
        <div className="scroll-content">
          {scrollingOffers.map((notif, index) => (
            <span key={index} className="mx-8 font-medium">
              {notif.message}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .scroll-wrapper {
          display: flex;
          overflow: hidden;
          white-space: nowrap;
          position: relative;
        }

        .scroll-content {
          display: inline-flex;
          will-change: transform;
          animation: scroll 6s linear infinite;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .scroll-wrapper:hover .scroll-content {
          animation-play-state: paused;
        }

        /* Make animation extremely smooth */
        @media (prefers-reduced-motion: no-preference) {
          .scroll-content {
            animation-timing-function: linear;
            backface-visibility: hidden;
            transform: translate3d(0, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default SubNavBar;
