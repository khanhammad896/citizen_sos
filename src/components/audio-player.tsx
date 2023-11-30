import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "@hooks/use-theme";
import { wp } from "@utils/helper";
import { Box } from "@components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "@components/ui/typography";
import AudioRecorderPlayer, {
  PlayBackType,
} from "react-native-audio-recorder-player";
import LottieView from "lottie-react-native";
import { PlayerState } from "@utils/types";
import Wave from "@assets/media/wave.json";
import { ThemeConfig } from "@theme/index";

interface AudioPlayerProps extends TouchableOpacityProps {
  audioRecorderPlayer: AudioRecorderPlayer;
  voice: PlayerState;
}

const AudioPlayer: FC<AudioPlayerProps> = ({
  audioRecorderPlayer,
  voice,
  ...props
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const [state, setState] = useState<PlayerState>(voice);
  const lottieRef = useRef<LottieView>(null);

  const playAnimation = useCallback(() => {
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  }, []);

  const onStartPlay = async (path: string): Promise<void> => {
    try {
      await audioRecorderPlayer.startPlayer(path);
      await audioRecorderPlayer.setVolume(1.0);
      playAnimation();
      audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition === e.duration) {
          lottieRef.current?.reset();
          return setState((prevState) => ({
            ...prevState,
            isPlaying: false,
            playTime: "00:00",
          }));
        }
        return setState((prevState) => ({
          ...prevState,
          isPlaying: true,
          currentPositionSec: e.currentPosition,
          currentDurationSec: e.duration,
          playTime: audioRecorderPlayer.mmss(
            Math.floor(e.currentPosition / 1000),
          ),
          duration: audioRecorderPlayer.mmss(Math.floor(e.duration / 1000)),
        }));
      });
    } catch (err) {
      console.log("startPlayer error", err);
    }
  };

  const onStopPlay = async (): Promise<void> => {
    try {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setState((prevState) => ({
        ...prevState,
        isPlaying: false,
      }));
      lottieRef.current?.reset();
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    setState(voice);
  }, [voice]);
  return (
    Boolean(state) && (
      <TouchableOpacity style={styles.root} {...props}>
        <Box full row between centered stretched style={styles.audioPlayer}>
          <TouchableOpacity
            onPress={
              state.isPlaying ? onStopPlay : () => onStartPlay(state.path)
            }
          >
            <FontAwesomeIcon
              size={wp(28)}
              color={colors.secondary}
              icon={["fat", state.isPlaying ? "circle-pause" : "circle-play"]}
            />
          </TouchableOpacity>
          <Box
            stretched
            style={{
              marginHorizontal: wp(8),
              marginVertical: wp(10),
              overflow: "hidden",
            }}
          >
            <LottieView
              source={Wave}
              resizeMode="cover"
              autoPlay={false}
              loop
              style={{
                width: "100%",
                height: 80,
              }}
              ref={lottieRef}
            />
          </Box>
          <Text.Medium color={colors.night} size={13}>
            {state.isPlaying ? state.playTime : state.duration}
          </Text.Medium>
        </Box>
      </TouchableOpacity>
    )
  );
};

export default AudioPlayer;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      height: wp(67),
      width: "100%",
      flex: 1,
    },
    audioPlayer: {
      backgroundColor: colors.light,
      paddingHorizontal: wp(14),
      paddingVertical: wp(10),
      borderRadius: wp(8),
      elevation: 6,
      shadowColor: "rgba(0,0,0,0.2)",
      shadowOpacity: 0.2,
    },
  });
