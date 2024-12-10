import { Tab } from "@headlessui/react";
import PropTypes from "prop-types";
import { Button } from "@/components";

const Tabs = ({
  tab = [],
  vertical = false,
  children = null,
  defaultIndex = 0,
  onTabChange = () => {},
  hidden = false,
}) => {
  return (
    <Tab.Group
      defaultIndex={defaultIndex}
      as="div"
      className={`${vertical ? "flex gap-4" : ""}`}
      onChange={onTabChange} // Pass onTabChange directly
    >
      {!hidden && (
        <Tab.List
          className={`flex flex-wrap gap-2 ${
            vertical ? "flex-col w-fit" : "mb-4"
          }`}
        >
          {tab.map((item, index) => (
            <Tab key={index} as="div" className={`outline-none`}>
              {({ selected }) => (
                <Button
                  variant={selected ? "solid" : "text"}
                  color={selected ? "primary" : "#888888"}
                >
                  {item}
                </Button>
              )}
            </Tab>
          ))}
        </Tab.List>
      )}
      <Tab.Panels className="flex-1">
        {children && children.length > 0 ? (
          children.map((child, index) => (
            <Tab.Panel key={index}>{child}</Tab.Panel>
          ))
        ) : (
          <Tab.Panel>{children}</Tab.Panel>
        )}
      </Tab.Panels>
    </Tab.Group>
  );
};

Tabs.propTypes = {
  tab: PropTypes.array,
  vertical: PropTypes.bool,
  children: PropTypes.node,
  defaultIndex: PropTypes.number,
  onTabChange: PropTypes.func,
};

export default Tabs;
