import React from "react";
import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProjectCard = ({
  completionPercentage = 100,
  startDate,
  due_date,
  todo_completed,
  total_todo,
  left_day,
}) => {
  return (
    <div className="w-[20rem] h-[16rem] bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-200 p-4 text-white ">
        <div className="flex justify-center">
          <div className="w-24 h-24 border-2-white rounded-full bg-white flex items-center justify-center">
            <CircularProgressbarWithChildren
              value={completionPercentage}
              text={`${completionPercentage}%`}
            />
          </div>
        </div>
      </div>
      <div className="p-4 space-y-1">
        <p className="text-gray-700 text-xs">
          Tanggal mulai: <span className="font-semibold">{startDate}</span>
        </p>
        <p className="text-gray-700 text-xs">
          Batas Waktu:
          <span className="font-semibold"> {due_date}</span>
        </p>
        <p className="text-gray-700 text-xs">
          Todo Yang Terselesaikan:
          <span className="font-semibold"> {todo_completed}</span>
        </p>
        <p className="text-gray-700 text-xs">
          Total Todo:
          <span className="font-semibold"> {total_todo}</span>
        </p>
        <p className="text-gray-700 text-xs">
          Tersisa:
          <span className="font-semibold"> {left_day} </span>
          Hari
        </p>
      </div>
    </div>
  );
};

export default ProjectCard;
