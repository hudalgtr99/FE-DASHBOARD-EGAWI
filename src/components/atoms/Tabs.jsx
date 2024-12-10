// Tabs.js
import React from 'react';
import { Button } from '../../components';

const Tabs = ({ activeTab, tabComponents, onTabChange }) => {
  return (
    <div className="tabs flex gap-2">
      {tabComponents.map(({ key, label }) => (
        <Button
          key={key}
          variant={activeTab === key ? "solid" : "text"}
          color={activeTab === key ? "primary" : "#888888"}
          onClick={() => onTabChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
