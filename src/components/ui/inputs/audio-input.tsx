import {
  Animated,
  Easing,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from "react-native";
import React, { FC, useEffect, useRef, useState } from "react";
import { useTheme } from "@hooks/use-theme";
import { Box } from "@components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { wp } from "@utils/helper";
import { Text } from "@components/ui/typography";
import AudioRecorderPlayer, {
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  AVEncoderAudioQualityIOSType,
  AudioSet,
  OutputFormatAndroidType,
  RecordBackType,
} from "react-native-audio-recorder-player";
import RNFS from "react-native-fs";
import { format } from "date-fns";
import { PlayerState } from "@utils/types";
import { ThemeConfig } from "@theme/index";

interface AudioInputProps extends ViewProps {
  audioRecorderPlayer: AudioRecorderPlayer;
  onClose: () => void;
  onChange: (voice: string) => void;
  handleAddVoiceNote: (voice: PlayerState) => void;
}

const audioSet: AudioSet = {
  AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
  AudioSourceAndroid: AudioSourceAndroidType.MIC,
  AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
  AVNumberOfChannelsKeyIOS: 2,
  AVFormatIDKeyIOS: AVEncodingOption.aac,
  OutputFormatAndroid: OutputFormatAndroidType.AAC_ADTS,
};

const generateName = () => {
  const date = format(new Date(), "dd-MM-yyyy-hh-mm-ss");
  return `ICT_15-${date}`;
};

const AudioInput: FC<AudioInputProps> = ({
  audioRecorderPlayer,
  onClose,
  onChange,
  handleAddVoiceNote,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const path = Platform.select({
    ios: "hello.m4a",
    android: `${RNFS.DocumentDirectoryPath}/${generateName()}.mp3`,
  });
  const [state, setState] = useState({
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: "00:00",
  });
  const opacity = useRef(new Animated.Value(1)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);

  const onStartRecord = async (): Promise<void> => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);

        console.log("write external storage", grants);

        if (
          grants["android.permission.WRITE_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.READ_EXTERNAL_STORAGE"] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          grants["android.permission.RECORD_AUDIO"] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("permissions granted");
        } else {
          console.log("All required permissions not granted");

          return;
        }
      } catch (err) {
        console.warn(err);
        return;
      }
    }

    await audioRecorderPlayer.startRecorder(path, audioSet);

    audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
      setState((prevState) => ({
        ...prevState,
        recordSecs: e.currentPosition,
        recordTime: audioRecorderPlayer.mmss(
          Math.floor(e.currentPosition / 1000),
        ),
      }));
    });
  };

  const onStopRecord = async (): Promise<void> => {
    const result = await audioRecorderPlayer.stopRecorder();
    onChange(result);
    audioRecorderPlayer.removeRecordBackListener();
    handleAddVoiceNote({
      currentDurationSec: 0,
      currentPositionSec: 0,
      playTime: "00:00",
      duration: state.recordTime,
      isPlaying: false,
      path: result,
    });
    setState((prevState) => ({
      ...prevState,
      recordSecs: 0,
    }));
    onClose();
  };

  const startBlinking = () => {
    animation.current = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500, // Adjust the duration as needed
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500, // Adjust the duration as needed
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      { iterations: -1 }, // -1 means infinite loop
    );
    animation.current.start();
  };

  const stopBlinking = () => {
    animation.current?.stop();
  };

  useEffect(() => {
    onStartRecord();
    startBlinking();

    return () => {
      stopBlinking();
    };
  }, []);
  return (
    <Box full row between centered style={styles.audioRecorder}>
      <TouchableOpacity onPress={onStopRecord}>
        <FontAwesomeIcon
          size={wp(30)}
          color={colors.secondary}
          icon={["fat", "circle-stop"]}
        />
      </TouchableOpacity>
      <Box row centered>
        <Animated.View style={[{ marginRight: wp(10), opacity }]}>
          <FontAwesomeIcon
            size={wp(16)}
            color={colors.secondary}
            icon={["fas", "microphone"]}
          />
        </Animated.View>
        <Text.Medium color={colors.night} size={13}>
          {state.recordTime}
        </Text.Medium>
      </Box>
    </Box>
  );
};

export default AudioInput;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    audioRecorder: {
      height: wp(67),
      backgroundColor: colors.light,
      paddingHorizontal: wp(14),
      paddingVertical: wp(10),
      borderRadius: wp(8),
      marginBottom: wp(32),
      elevation: 6,
      shadowColor: "rgba(0,0,0,0.2)",
      shadowOpacity: 0.2,
      maxWidth: wp(300),
    },
  });
