import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

interface TabIconProps {
  name: "home" | "dashboard" | "thu_chi" | "thong_ke" | "user" | "add";
  focused: boolean;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({
  name,
  focused,
  size = 25,
}) => {
  // Different colors for different tabs
  const getIconColor = () => {
    if (name === "home") {
      return focused ? "#42A6ED" : "#7A7777";
    } else if (name === "thu_chi") {
      return focused ? "#3B82F6" : "#7A7777";
    } else if (name === "thong_ke") {
      return focused ? "#3B82F6" : "#7A7777";
    } else if (name === "user") {
      return focused ? "#3B82F6" : "#7A7777";
    }
    return focused ? "#3B82F6" : "#7A7777";
  };

  const iconColor = getIconColor();
  const iconSize = size;

  const renderIcon = () => {
    switch (name) {
      case "home":
        return (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 25 25"
            fill="none"
          >
            <Path
              d="M21.33 8.51002L14.78 3.27002C13.5 2.25002 11.5 2.24002 10.23 3.26002L3.67996 8.51002C2.73996 9.26002 2.16996 10.76 2.36996 11.94L3.62996 19.48C3.91996 21.17 5.48996 22.5 7.19996 22.5H17.8C19.49 22.5 21.09 21.14 21.38 19.47L22.64 11.93C22.82 10.76 22.25 9.26002 21.33 8.51002ZM13.25 18.5C13.25 18.91 12.91 19.25 12.5 19.25C12.09 19.25 11.75 18.91 11.75 18.5V15.5C11.75 15.09 12.09 14.75 12.5 14.75C12.91 14.75 13.25 15.09 13.25 15.5V18.5Z"
              fill={iconColor}
            />
          </Svg>
        );

      case "thu_chi":
        return (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 25 25"
            fill="none"
          >
            <Path
              d="M2.5 17.56H12.5"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeMiterlimit="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M4.71997 14H10.28C12.06 14 12.5 14.44 12.5 16.2V20.31C12.5 22.07 12.06 22.51 10.28 22.51H4.71997C2.93997 22.51 2.5 22.07 2.5 20.31V16.2C2.5 14.44 2.93997 14 4.71997 14Z"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={focused ? iconColor : "none"}
            />
            <Path
              d="M22.5 15.5C22.5 19.37 19.37 22.5 15.5 22.5L16.55 20.75"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M2.5 9.5C2.5 5.63 5.63 2.5 9.5 2.5L8.45001 4.25"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M19 11.5C21.4853 11.5 23.5 9.48528 23.5 7C23.5 4.51472 21.4853 2.5 19 2.5C16.5147 2.5 14.5 4.51472 14.5 7C14.5 9.48528 16.5147 11.5 19 11.5Z"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={focused ? iconColor : "none"}
            />
          </Svg>
        );

      case "thong_ke":
        return (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 25 25"
            fill="none"
          >
            {/* Background rounded rectangle */}
            <Path
              d="M9.5 22.5H15.5C20.5 22.5 22.5 20.5 22.5 15.5V9.5C22.5 4.5 20.5 2.5 15.5 2.5H9.5C4.5 2.5 2.5 4.5 2.5 9.5V15.5C2.5 20.5 4.5 22.5 9.5 22.5Z"
              fill={focused ? iconColor : "none"}
              stroke={focused ? "none" : iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Left bar (shorter) */}
            <Path
              d="M9 19C10.1 19 11 18.1 11 17V13.5C11 12.4 10.1 11.5 9 11.5C7.9 11.5 7 12.4 7 13.5V17C7 18.1 7.89 19 9 19Z"
              fill={focused ? "white" : "none"}
              stroke={focused ? "none" : iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Right bar (taller) */}
            <Path
              d="M16 19C17.1 19 18 18.1 18 17V8C18 6.9 17.1 6 16 6C14.9 6 14 6.9 14 8V17C14 18.1 14.89 19 16 19Z"
              fill={focused ? "white" : "none"}
              stroke={focused ? "none" : iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case "user":
        return (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 25 25"
            fill="none"
          >
            <Path
              d="M12.5 12.5C15.2614 12.5 17.5 10.2614 17.5 7.5C17.5 4.73858 15.2614 2.5 12.5 2.5C9.73858 2.5 7.5 4.73858 7.5 7.5C7.5 10.2614 9.73858 12.5 12.5 12.5Z"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={focused ? iconColor : "none"}
            />
            <Path
              d="M21.09 22.5C21.09 18.63 17.24 15.5 12.5 15.5C7.76003 15.5 3.91003 18.63 3.91003 22.5"
              stroke={iconColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      case "add":
        return (
          <Svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 25 25"
            fill="none"
          >
            <Path
              d="M12.5 5V20"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M5 12.5H20"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        );

      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
