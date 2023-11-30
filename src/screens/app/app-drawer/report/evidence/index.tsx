import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import AudioRecorderPlayer from "react-native-audio-recorder-player";

import { Box, DrawerLayout, RootLayout } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import Cover from "@assets/media/cover.png";
import { showToast, wp } from "@utils/helper";
import { API_ENDPOINTS, PX, SCREEN_WIDTH } from "@utils/constants";
import Title from "@assets/media/title.svg";
import TitleUr from "@assets/media/title-ur.svg";
import { PrimaryButton } from "@components/ui/buttons";
import { Text } from "@components/ui/typography";
import {
  ImageAssetType,
  ImageType,
  PlayerState,
  ReportScreenProps,
  VideoAssetType,
  VideoType,
} from "@utils/types";
import { PictureInput, VideoInput, AudioInput } from "@components/ui/inputs";
import AudioPlayer from "@components/audio-player";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import SuccessModal from "@components/ui/modals/success-modal";
import {
  SaveLeadsMediaType,
  useSaveLeadsMediaMutation,
} from "@framework/basic-rest/leads/use-save-leads-media";
import { CommonActions } from "@react-navigation/native";
import { Loader } from "@components/ui/progress";
import LottieView from "lottie-react-native";
import Confetti from "@assets/media/confetti.json";
import DeleteModal from "@components/ui/modals/delete-modal";
import { queryClient } from "App";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";

const validationSchema = z.object({
  lead_id: z.number(),
  file_image: ImageType.nullable().optional(),
  file_audio: z.string().nullable().optional(),
  file_video: VideoType.nullable().optional(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

type EvidenceProps = ReportScreenProps<"evidence">;

const isEvidence = (
  image?: ImageAssetType | null,
  video?: VideoAssetType | null,
  audio?: PlayerState | null,
) => {
  return Boolean(image) || Boolean(video) || Boolean(audio);
};

const audioRecorderPlayer = new AudioRecorderPlayer();
audioRecorderPlayer.setSubscriptionDuration(0.1);

const Evidence: FC<EvidenceProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors, direction } = theme;
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();
  const [record, setRecord] = useState(false);
  const [audio, setAudio] = useState<PlayerState | null>(null);
  const successModalRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<BottomSheetModal>(null);
  const [mediaType, setMediaType] = useState<"audio" | "image" | "video">(
    "audio",
  );
  const { lead_id } = route.params;
  const { t } = useTranslation();

  const { mutate: SaveLeadsMedia, isPending } = useSaveLeadsMediaMutation();

  const { control, handleSubmit, watch, setValue } =
    useForm<SaveLeadsMediaType>({
      defaultValues: {
        lead_id,
        file_image: null,
        file_video: null,
        file_audio: null,
      },
      resolver: zodResolver(validationSchema),
    });

  const handleOpenRecorder = () => setRecord(true);

  const handleCloseRecorder = () => setRecord(false);

  const handleAddVoiceNote = (voice: PlayerState) => {
    setAudio(voice);
  };

  const handleOpenSuccessModal = () => {
    successModalRef.current?.present();
  };

  const handleCloseSuccessModal = () => {
    setTimeout(() => {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "history",
            },
          ],
        }),
      );
    }, 100);
    successModalRef.current?.dismiss();
  };

  const handleOpenDeleteModal = (type: "audio" | "image" | "video") => {
    setMediaType(type);
    deleteModalRef.current?.present();
  };

  const handleCloseDeleteModal = () => {
    deleteModalRef.current?.dismiss();
  };

  const file_image = watch("file_image");
  const file_video = watch("file_video");

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: SaveLeadsMediaType,
  ) => {
    const image = {
      uri: data.file_image?.uri,
      name: data.file_image?.fileName,
      type: data.file_image?.type,
    };
    const video = {
      uri: data.file_video?.uri,
      name: data.file_video?.fileName,
      type: data.file_video?.type,
    };
    const voice = {
      name: "audio",
      type: "audio/mp3",
      uri: data.file_audio,
    };
    const input = new FormData();
    input.append("lead_id", lead_id);
    if (data.file_image) {
      input.append("file_image", image);
    }
    if (data.file_video) {
      input.append("file_video", video);
    }
    if (data.file_audio) {
      input.append("file_audio", voice);
    }
    SaveLeadsMedia(input, {
      onSuccess: (res) => {
        if (res.error)
          return showToast(
            "error",
            typeof res.error_messages === "string"
              ? res.error_messages
              : res.message,
          );
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.LEADS.USER_SOS],
        });
        return handleOpenSuccessModal();
      },
      onError: (err) => {
        console.log(err);
        showToast(
          "error",
          "Can't send your media right now. Please try again!",
        );
      },
    });
  };

  const handleOpenMedia = (type: "image/jpeg" | "video/mp4", uri: string) => {
    navigation.navigate("light-box", { type, uri });
  };

  const handleDeleteMedia = (type: "audio" | "image" | "video") => {
    if (type === "audio") {
      setValue("file_audio", null);
      setAudio(null);
    }
    if (type === "image") {
      setValue("file_image", null);
    }
    if (type === "video") {
      setValue("file_video", null);
    }
    handleCloseDeleteModal();
  };

  return (
    <>
      {isPending && <Loader />}
      <DrawerLayout>
        <RootLayout cover={false} safe={false} style={{ paddingHorizontal: 0 }}>
          <Box stretched>
            <View style={styles.cover}>
              <ImageBackground source={Cover} style={styles.background}>
                <Box
                  row
                  centered
                  between
                  style={[
                    styles.header,
                    {
                      marginTop:
                        Platform.OS === "android" ? insets.top : wp(20),
                      paddingBottom: Platform.select({
                        android: wp(30),
                      }),
                    },
                  ]}
                >
                  <Box
                    style={{
                      position: "absolute",
                      left: wp(PX),
                      top: Platform.select({ android: wp(30) }),
                      zIndex: 9,
                    }}
                  >
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <FontAwesomeIcon
                        icon={["fal", "xmark"]}
                        color={colors.light}
                        size={wp(20)}
                      />
                    </TouchableOpacity>
                  </Box>
                  <Box full centered>
                    {direction === "ltr" ? (
                      <Title width={wp(132)} height={wp(30)} />
                    ) : (
                      <TitleUr width={wp(132)} height={wp(30)} />
                    )}
                  </Box>
                </Box>
              </ImageBackground>
            </View>
            <Box full stretched style={{ paddingBottom: wp(44) }}>
              <Box
                centered
                stretched={!isEvidence(file_image, file_video, audio)}
                justifiedEnd
                full
                style={styles.content}
              >
                {!isEvidence(file_image, file_video, audio) && (
                  <Box centered style={{ marginBottom: wp(54) }}>
                    {!record && (
                      <View style={styles.gifContainer}>
                        <LottieView
                          style={{ width: wp(140), height: wp(140) }}
                          source={Confetti}
                          autoPlay
                          loop
                          resizeMode="cover"
                        />
                      </View>
                    )}
                    <Text.Bold
                      aligned="center"
                      size={32}
                      color={colors.success}
                    >
                      {t(tokens.evidence.thankyou)}
                    </Text.Bold>
                    <Text.Regular
                      style={{ lineHeight: wp(24), maxWidth: wp(233) }}
                      aligned="center"
                      size={16}
                    >
                      {t(tokens.evidence.incident)}
                    </Text.Regular>
                  </Box>
                )}
                <Text.Bold
                  aligned="center"
                  size={16}
                  style={{ marginBottom: wp(4) }}
                >
                  {t(tokens.evidence.help)}
                </Text.Bold>
                <Text.Regular
                  style={{ lineHeight: wp(24), maxWidth: wp(230) }}
                  aligned="center"
                  size={16}
                >
                  {t(tokens.evidence.attach)}
                </Text.Regular>
                <Box row style={styles.actionContainer}>
                  <Box stretched>
                    {/* Picture */}
                    <Controller
                      control={control}
                      name="file_image"
                      render={({ field: { onChange } }) => (
                        <PictureInput onChange={onChange} disable={record} />
                      )}
                    />
                  </Box>
                  <Box stretched>
                    {/* Video */}
                    <Controller
                      control={control}
                      name="file_video"
                      render={({ field: { onChange } }) => (
                        <VideoInput onChange={onChange} disable={record} />
                      )}
                    />
                  </Box>
                  <Box stretched>
                    {/* Voice */}
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={handleOpenRecorder}
                      disabled={record}
                    >
                      <FontAwesomeIcon
                        icon={["fal", "microphone"]}
                        color={colors.light}
                      />
                      <Text.Medium
                        style={{ marginTop: wp(9) }}
                        color={colors.light}
                        size={10}
                        spacing={-0.2}
                      >
                        {t(tokens.evidence.voice)}
                      </Text.Medium>
                    </TouchableOpacity>
                  </Box>
                </Box>
              </Box>
              <Box
                centered
                full
                style={{ marginTop: wp(81), paddingHorizontal: wp(PX) }}
              >
                {record && (
                  <Controller
                    control={control}
                    name="file_audio"
                    render={({ field: { onChange } }) => (
                      <AudioInput
                        audioRecorderPlayer={audioRecorderPlayer}
                        onChange={onChange}
                        onClose={handleCloseRecorder}
                        handleAddVoiceNote={handleAddVoiceNote}
                      />
                    )}
                  />
                )}

                {isEvidence(file_image, file_video, audio) ? (
                  <Box row justified>
                    <Box
                      full
                      row
                      stretched
                      centered
                      style={{
                        marginLeft: wp(-8),
                        marginTop: audio ? wp(17) : wp(-8),
                        maxWidth: wp(300),
                      }}
                    >
                      {audio !== null && (
                        <AudioPlayer
                          audioRecorderPlayer={audioRecorderPlayer}
                          voice={audio}
                          onLongPress={() => handleOpenDeleteModal("audio")}
                        />
                      )}
                      {Boolean(file_image) && (
                        <TouchableOpacity
                          style={styles.thumbnail}
                          onPress={() =>
                            handleOpenMedia("image/jpeg", file_image?.uri ?? "")
                          }
                          onLongPress={() => handleOpenDeleteModal("image")}
                        >
                          <Image
                            source={{
                              uri: file_image?.uri,
                            }}
                            resizeMode="cover"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </TouchableOpacity>
                      )}
                      {Boolean(file_video) && (
                        <TouchableOpacity
                          style={styles.thumbnail}
                          onPress={() =>
                            handleOpenMedia("video/mp4", file_video?.uri ?? "")
                          }
                          onLongPress={() => handleOpenDeleteModal("video")}
                        >
                          <Box centered justified style={styles.videoOverlay}>
                            <FontAwesomeIcon
                              icon={["fal", "circle-play"]}
                              color={colors.light}
                              size={wp(30)}
                            />
                          </Box>
                          <Image
                            source={{
                              uri: file_video?.uri,
                            }}
                            resizeMode="cover"
                            style={{ width: "100%", height: "100%" }}
                          />
                        </TouchableOpacity>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Text.Medium
                    aligned="center"
                    color={colors.fade}
                    style={{ maxWidth: wp(197) }}
                  >
                    {t(tokens.evidence.identity)}
                  </Text.Medium>
                )}
              </Box>
            </Box>
          </Box>
          <Box style={{ paddingHorizontal: wp(PX), marginBottom: wp(16) }}>
            {isEvidence(file_image, file_video, audio) && (
              <PrimaryButton
                style={{ marginBottom: wp(10) }}
                onPress={handleSubmit(onSubmit)}
                disabled={record}
                bgcolor={record ? colors.off : colors.primary}
              >
                {t(tokens.common.submit)}
              </PrimaryButton>
            )}
            <PrimaryButton
              disabled={record}
              variant="outlined"
              onPress={() =>
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "history",
                      },
                    ],
                  }),
                )
              }
            >
              {isEvidence(file_image, file_video, audio)
                ? t(tokens.common.cancel)
                : t(tokens.common.cancel)}
            </PrimaryButton>
          </Box>
        </RootLayout>
      </DrawerLayout>
      <SuccessModal ref={successModalRef} onClose={handleCloseSuccessModal} />
      <DeleteModal
        ref={deleteModalRef}
        mediaType={mediaType}
        handleDelete={handleDeleteMedia}
      />
    </>
  );
};

export default Evidence;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    cover: {
      position: "absolute",
      zIndex: 20,
      top: 0,
      width: SCREEN_WIDTH,
      height: wp(116),
      borderBottomLeftRadius: wp(45),
      borderBottomRightRadius: wp(45),
      overflow: "hidden",
    },
    background: {
      width: "100%",
      height: "100%",
    },
    header: {
      paddingHorizontal: wp(PX),
      height: "100%",
    },
    content: {
      minHeight: wp(279),
      borderColor: colors.zinc,
      borderWidth: 1,
      backgroundColor: colors.light,
      borderBottomLeftRadius: wp(50),
      borderBottomRightRadius: wp(50),
      paddingHorizontal: wp(PX),
    },
    actionContainer: {
      backgroundColor: colors.success,
      borderRadius: wp(20),
      paddingHorizontal: wp(30),
      width: wp(254),
      height: wp(60),
      marginTop: wp(30),
      marginBottom: wp(-30),
    },
    actionButton: {
      width: "100%",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    thumbnail: {
      width: wp(67),
      height: wp(67),
      borderRadius: wp(8),
      backgroundColor: colors.zinc,
      overflow: "hidden",
      marginLeft: wp(8),
    },
    videoOverlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 10,
    },
    gifContainer: {
      marginTop: wp(116),
      marginBottom: wp(4),
    },
  });
