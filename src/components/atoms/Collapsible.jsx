import { ThemeContext } from "@/context/ThemeContext";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import { useContext } from "react";
import { FiChevronRight } from "react-icons/fi";
import PropTypes from "prop-types";

/**
 *
 * @param {{
 * multiple: boolean;
 * initialexpanded: boolean;
 * children: React.ReactNode;
 * }}
 *
 */

const Collapsible = ({ multiple, initialexpanded, children }) => {
  return (
    <Accordion
      allowMultiple={multiple}
      initialEntered={initialexpanded}
      className="w-full"
      transition
      transitionTimeout={300}
    >
      {children}
    </Accordion>
  );
};

/**
 *
 * @param {{
 * header: React.ReactNode;
 * children: React.ReactNode;
 * icon: React.ReactNode;
 * initialexpanded: boolean;
 * disabled: boolean;
 * }}
 *
 */

const CollapsibleItem = ({
  header,
  children,
  icon,
  initialexpanded,
  disabled,
}) => {
  const { themeSkin } = useContext(ThemeContext);
  return (
    <AccordionItem
      disabled={disabled}
      initialEntered={initialexpanded}
      className={`text-sm mb-2 rounded-md  ${
        themeSkin === "default"
          ? "shadow-[0_2px_10px_rgb(0,0,0,0.1)] bg-white dark:bg-base-600"
          : themeSkin
      }`}
      buttonProps={{
        className: "w-full text-left px-4 py-3 min-h-[42px]",
      }}
      contentProps={{
        className: "transition-all ease-in-out duration-300",
      }}
      header={({ state: { isEnter } }) => (
        <div className="flex items-center justify-between w-full">
          {header}
          {icon ? (
            icon
          ) : (
            <FiChevronRight
              className={`transition-transform duration-300 ${
                isEnter ? "rotate-90" : ""
              }`}
            />
          )}
        </div>
      )}
    >
      <div className="px-4 pb-3 text-sm text-left text-wrap">{children}</div>
    </AccordionItem>
  );
};

Collapsible.propTypes = {
  multiple: PropTypes.bool,
  initialexpanded: PropTypes.bool,
  children: PropTypes.node,
};

CollapsibleItem.propTypes = {
  header: PropTypes.node,
  children: PropTypes.node,
  icon: PropTypes.node,
  initialexpanded: PropTypes.bool,
  disabled: PropTypes.bool,
};

Collapsible.Item = CollapsibleItem;

export default Collapsible;
