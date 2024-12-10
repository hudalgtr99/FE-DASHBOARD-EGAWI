import React from "react";
import { Link } from "react-router-dom";
import { Button, Avatar } from "../../components";

const Card = ({ image, nama, pk, to = "#" }) => {
  return (
    <div
      className={`relative flex flex-col gap-2 min-h-[280px] max-h-[280px] pt-4 px-6 bg-white/80 rounded-md shadow-md dark:bg-base-600`}
    >
      {image ? (
        <div className="flex mb-4 h-28">
          <img src={image} alt={nama} className="object-contain w-full" />
        </div>
      ) : (
        <div className="flex justify-center items-center mb-4">
          <Avatar rounded="md" className="w-full h-28 text-xl" color="primary">
            {nama.substring(0, 2).toUpperCase()}
          </Avatar>
        </div>
      )}
      <div className="font-bold text-lg line-clamp-2 text-center">{nama}</div>
      <div className="absolute bottom-4 w-full -mx-6 flex justify-center items-center">
        <Link to={to}>
          <Button>Lihat</Button>
        </Link>
      </div>
    </div>
  );
};

export default Card;
