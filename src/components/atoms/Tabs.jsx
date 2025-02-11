// Tabs.js
import React from "react";
import { Button } from "../../components";

const Tabs = ({ activeTab, tabComponents, onTabChange, hidden }) => {
  return (
    <div className={`tabs flex gap-2 ${hidden ? "hidden" : ""}`}>
      {tabComponents.map(({ key, label }) => {
        console.log(sessionStorage.getItem(label) === "false");
        return (
          <Button
            key={key}
            variant={activeTab === key ? "solid" : "text"}
            color={activeTab === key ? "primary" : "#888888"}
            onClick={() => onTabChange(key)}
            disabled={sessionStorage.getItem(label) === "false"}
          >
            {label}
          </Button>
        );
      })}
    </div>
  );
};

export default Tabs;
