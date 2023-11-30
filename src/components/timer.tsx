import { TouchableOpacity, ViewProps } from "react-native";
import React, { FC, useEffect, useState } from "react";
import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import { Box } from "./layout";
import { Text } from "./ui/typography";

interface TimerProps extends ViewProps {
  handleResend: () => void;
}

const Timer: FC<TimerProps> = ({ handleResend }) => {
  const theme = useTheme();
  const { colors } = theme;
  const [timer, setTimer] = useState<number>(20);
  const [resend, setResend] = useState<boolean>(true);

  const handleClick = () => {
    handleResend();
    setTimer(20);
    setResend(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setResend(true);
    }
  }, [timer]);
  return (
    <Box row centered style={{ marginTop: wp(24) }}>
      <Text.Regular>If you didn’t receive a code! </Text.Regular>
      {resend ? (
        <TouchableOpacity onPress={handleClick}>
          <Text.Regular color={colors.secondary}>Resend</Text.Regular>
        </TouchableOpacity>
      ) : (
        <Text.Regular>
          Resend in{" "}
          <Text.Regular color={colors.secondary}>
            0:{timer < 10 && "0"}
            {timer}
          </Text.Regular>
        </Text.Regular>
      )}
    </Box>
  );
};

export default Timer;
