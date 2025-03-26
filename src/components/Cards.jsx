import React from "react";
import { Link } from "react-router-dom";
import { BiLinkExternal } from "react-icons/bi";
import { FaRegCalendarAlt } from "react-icons/fa";

const Cards = ({ data , isEven  }) => {
  return (
    <div className="bg-white rounded-md p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-M-text-color/50 font-semibold uppercase ">
          {data.category}
        </h4>
        <Link>
          <BiLinkExternal className="text-base text-M-text-color/50 font-semibold" />
        </Link>
      </div>

      {/* Main Info */}
      <div className="flex items-center py-5">
        <span className="bg-M-primary-color/15 inline-flex items-center justify-center size-9 rounded-md text-M-primary-color">
          <FaRegCalendarAlt size={22} />
        </span>
        <span className="text-[22px] text-M-text-color font-bold pl-3 pr-4">
          {data.total}
        </span>
        {data.status && (
          <span className="text-[10px] text-white bg-M-Green-color px-1 py-[2px] rounded">
            {data.status}
          </span>
        )}
      </div>

      {/* List of Details */}
      <ul className="list-none my-0 p-0 space-y-2">
        {data.cardListDetails.map((item, index) => (
          <li
            key={index}
            className={`text-sm text-M-text-color/70 font-inter font-medium flex items-center justify-between relative pl-4  before:bg-M-primary-color/70 before:absolute before:left-0 ${isEven ? 'before:size-[6px] before:rounded-full' : 'before:w-[6px] before:h-[2px]'}`}
          >
            {item.label}
            <span className="font-medium text-M-heading-color">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Cards;
