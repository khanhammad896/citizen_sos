import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { FC, useRef, useState } from "react";
import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { getError, showToast, wp } from "@utils/helper";
import { Box, DrawerLayout, RootLayout } from "@components/layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CoverExtended from "@assets/media/cover-extended.png";
import { AppDrawerScreenProps, ProfileInputType } from "@utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { Text } from "@components/ui/typography";
import { DrawerActions } from "@react-navigation/native";
import { PrimaryAvatar } from "@components/ui/avatars";
import Input from "@components/ui/inputs/primary-input";
import { useAuth } from "@hooks/use-auth";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PrimaryButton } from "@components/ui/buttons";
import { useEditUserMutation } from "@framework/basic-rest/profile/use-edit-profile";
import { useDrawerStatus } from "@react-navigation/drawer";
import { Loader } from "@components/ui/progress";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import ConfirmationModal from "@components/ui/modals/confirmation-modal";
import { useTranslation } from "react-i18next";
import { tokens } from "@locales/tokens";

type ProfileProps = AppDrawerScreenProps<"profile">;

const validationSchema = z.object({
  first_name: z
    .string()
    .min(1, "Please enter your first name")
    .regex(/^[a-zA-Z]+$/, "Please enter valid first name"),
  last_name: z
    .string()
    .min(1, "Please enter your last name")
    .regex(/^[a-zA-Z]+$/, "Please enter valid last name"),
  email: z
    .string()
    .min(1, "Please enter your email")
    .email("Please enter valid email"),
  contact_number: z.string().min(11, "Please enter your valid phone no"),
  cnic: z.string().min(13, "Please enter valid CNIC"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Profile: FC<ProfileProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors, direction } = theme;
  const styles = makeStyles();
  const insets = useSafeAreaInsets();
  const { user, update } = useAuth();
  const confirmationModal = useRef<BottomSheetModal>(null);
  const isDrawerOpen = useDrawerStatus() === "open";
  const { isEditable: editable } = route.params ?? { isEditable: false };
  const [isEditable, setIsEditable] = useState<boolean>(
    editable !== undefined ? editable : false,
  );
  const { mutate: EditUser, isPending } = useEditUserMutation();
  const { t } = useTranslation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      contact_number: user?.contact_number,
      cnic: user?.cnic ?? "",
    },
  });

  function toggleEdit() {
    setIsEditable((prev) => !prev);
  }

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: ProfileInputType,
  ) => {
    EditUser(data, {
      onSuccess: (res) => {
        if (res.error)
          return showToast(
            "error",
            typeof res.error_messages === "string"
              ? res.error_messages
              : res.message,
          );
        showToast("success", "Your profile has been updated");
        setIsEditable(false);
        return update(data);
      },
      onError: () =>
        showToast(
          "error",
          "Can't update your profile right now. Please try again!",
        ),
    });
  };

  const handleOpenConfirmationModal = () => {
    confirmationModal.current?.present();
  };

  const handleCloseConfirmationModal = () => {
    confirmationModal.current?.dismiss();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 25 : -400}
    >
      {isPending && <Loader />}
      <DrawerLayout>
        <RootLayout cover={false} safe={false} style={{ paddingHorizontal: 0 }}>
          <View style={styles.cover}>
            <ImageBackground source={CoverExtended} style={styles.background}>
              <Box
                stretched
                justified
                style={[
                  styles.header,
                  {
                    marginTop: Platform.OS === "android" ? insets.top : wp(25),
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.dispatch(DrawerActions.openDrawer())
                  }
                >
                  <FontAwesomeIcon
                    icon={["fal", isDrawerOpen ? "xmark" : "bars-sort"]}
                    color={colors.light}
                    size={wp(22)}
                  />
                </TouchableOpacity>
                <Box row centered style={{ marginTop: wp(26) }}>
                  <PrimaryAvatar
                    size={76}
                    radius={20}
                    name={`${user?.first_name} ${user?.last_name}`}
                  />
                  <Box style={{ marginLeft: wp(18) }}>
                    <Box full end={direction === "rtl"}>
                      <Text.Bold color={colors.light}>
                        {t(tokens.profile.welcome)}
                      </Text.Bold>
                    </Box>
                    <Text.Regular
                      color={colors.light}
                      size={20}
                      style={{ textTransform: "capitalize" }}
                    >
                      {user?.first_name} {user?.last_name}
                    </Text.Regular>
                    <Text.Regular color={colors.light}>
                      {user?.contact_number}
                    </Text.Regular>
                  </Box>
                </Box>
              </Box>
            </ImageBackground>
          </View>
          <ScrollView
            style={{ width: "100%" }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Box stretched full style={styles.content}>
              <Box stretched full>
                <Box
                  full
                  row
                  reversed={direction === "rtl"}
                  centered
                  between
                  style={{ marginBottom: wp(20) }}
                >
                  <Text.Medium>{t(tokens.profile.personal)}</Text.Medium>
                  {!isEditable && (
                    <TouchableOpacity onPress={toggleEdit}>
                      <FontAwesomeIcon
                        icon={["fas", "user-pen"]}
                        color={colors.primary}
                        size={wp(20)}
                      />
                    </TouchableOpacity>
                  )}
                </Box>
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="First name"
                      icon="user"
                      mt={0}
                      value={value}
                      onChangeText={onChange}
                      errorText={getError<ProfileInputType>(
                        errors,
                        "first_name",
                      )}
                      editable={isEditable}
                      style={{ color: isEditable ? colors.night : colors.off }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="last_name"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="Last name"
                      icon="user"
                      value={value}
                      onChangeText={onChange}
                      errorText={getError<ProfileInputType>(
                        errors,
                        "last_name",
                      )}
                      editable={isEditable}
                      style={{ color: isEditable ? colors.night : colors.off }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="contact_number"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="03xxxxxxxxx"
                      icon="phone"
                      value={value}
                      onChangeText={onChange}
                      errorText={getError<ProfileInputType>(
                        errors,
                        "contact_number",
                      )}
                      editable={false}
                      style={{ color: colors.off }}
                      keyboardType="number-pad"
                      maxLength={11}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="Email"
                      icon="envelope"
                      value={value}
                      onChangeText={onChange}
                      errorText={getError<ProfileInputType>(errors, "email")}
                      editable={isEditable}
                      style={{ color: isEditable ? colors.night : colors.off }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="cnic"
                  render={({ field: { value, onChange } }) => (
                    <Input
                      placeholder="CNIC"
                      icon="id-card"
                      value={value}
                      onChangeText={onChange}
                      errorText={getError<ProfileInputType>(errors, "cnic")}
                      editable={false}
                      style={{ color: colors.off }}
                      keyboardType="number-pad"
                      maxLength={13}
                    />
                  )}
                />
              </Box>
              <Box full style={{ marginTop: wp(20) }}>
                {isEditable && (
                  <>
                    <PrimaryButton
                      style={{ marginBottom: wp(12) }}
                      onPress={handleSubmit(onSubmit)}
                    >
                      {t(tokens.common.edit)}
                    </PrimaryButton>
                    <PrimaryButton
                      style={{ marginBottom: wp(12) }}
                      onPress={toggleEdit}
                      variant="outlined"
                      bgcolor={colors.danger}
                      color={colors.danger}
                    >
                      {t(tokens.common.cancel)}
                    </PrimaryButton>
                  </>
                )}

                {!isEditable && (
                  <PrimaryButton
                    bgcolor={colors.danger}
                    onPress={handleOpenConfirmationModal}
                  >
                    {t(tokens.profile.delete)}
                  </PrimaryButton>
                )}
              </Box>
            </Box>
          </ScrollView>
        </RootLayout>
      </DrawerLayout>
      <ConfirmationModal
        ref={confirmationModal}
        onClose={handleCloseConfirmationModal}
      />
    </KeyboardAvoidingView>
  );
};

export default Profile;

const makeStyles = () =>
  StyleSheet.create({
    cover: {
      position: "absolute",
      zIndex: 20,
      top: 0,
      width: SCREEN_WIDTH,
      height: wp(213),
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
      marginTop: wp(213),
      paddingHorizontal: wp(PX),
      paddingTop: wp(20),
    },
  });
