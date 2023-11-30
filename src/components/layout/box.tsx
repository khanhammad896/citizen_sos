import { type FC } from "react";
import { View, type ViewProps } from "react-native";

interface BoxProps extends ViewProps {
  row?: boolean;
  reversed?: boolean;
  centered?: boolean;
  justified?: boolean;
  justifiedEnd?: boolean;
  between?: boolean;
  end?: boolean;
  stretched?: boolean;
  full?: boolean;
}

const Box: FC<BoxProps> = ({
  children,
  row,
  reversed,
  centered,
  justified,
  justifiedEnd,
  between,
  end,
  stretched,
  full,
  style,
  ...props
}) => {
  return (
    <View
      style={[
        {
          flexDirection: row
            ? reversed
              ? "row-reverse"
              : "row"
            : reversed
            ? "column-reverse"
            : "column",
          alignItems: centered ? "center" : end ? "flex-end" : "flex-start",
          justifyContent: justified
            ? "center"
            : between
            ? "space-between"
            : justifiedEnd
            ? "flex-end"
            : "flex-start",
          ...(stretched && { flex: 1 }),
          ...(full && { width: "100%" }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

export default Box;
