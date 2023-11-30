import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { FC } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, RootLayout } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { getError, showToast, wp } from "@utils/helper";
import Cover from "@assets/media/cover.png";
import { AuthScreenProps, RegisterVerificationInputType } from "@utils/types";
import { Text } from "@components/ui/typography";
import { PrimaryButton } from "@components/ui/buttons";
import { ThemeConfig } from "@theme/index";
import { useRegisterVerificationMutation } from "@framework/basic-rest/auth/use-register-verification";
import { Loader } from "@components/ui/progress";

type VerificationProps = AuthScreenProps<"verification">;

const validationSchema = z.object({
  token: z.string().min(4, "Please enter OTP"),
  user_id: z.number(),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Verification: FC<VerificationProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();
  const { user_id, contact_number } = route.params;
  const { mutate: Verify, isPending } = useRegisterVerificationMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm<RegisterVerificationInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      token: "",
      user_id,
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: RegisterVerificationInputType,
  ) => {
    Verify(data, {
      onSuccess: (res) => {
        if (res.error) {
          resetField("token");
          return showToast(
            "error",
            typeof res.error_messages === "string"
              ? res.error_messages
              : res.message,
          );
        }
        showToast("success", "You've registered successfully");
        reset();
        return navigation.navigate("login");
      },
      onError: () =>
        showToast("error", "Can't register you right now. Please try again!"),
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 25 : -400}
    >
      {isPending && <Loader />}
      <RootLayout cover={false} safe={false} style={{ paddingHorizontal: 0 }}>
        <View style={styles.cover}>
          <ImageBackground source={Cover} style={styles.background}>
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
              <Box row>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <FontAwesomeIcon
                    icon={["fal", "xmark"]}
                    color={colors.light}
                    size={wp(22)}
                  />
                </TouchableOpacity>
                <Box style={{ marginLeft: wp(18) }}>
                  <Text.Bold size={16} color={colors.light}>
                    Verification Code
                  </Text.Bold>
                  <Text.Regular
                    color={colors.light}
                    style={{
                      maxWidth: wp(194),
                      marginTop: wp(8),
                      lineHeight: wp(20),
                    }}
                  >
                    Please type the verification code sent to {contact_number}.
                  </Text.Regular>
                </Box>
              </Box>
            </Box>
          </ImageBackground>
        </View>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        >
          <Box stretched style={styles.content}>
            <Box full stretched centered justified>
              <Controller
                control={control}
                name="token"
                render={({ field: { value, onChange } }) => (
                  <OTPInputView
                    key="focused"
                    style={styles.otpRoot}
                    pinCount={4}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeChanged={onChange}
                    autoFocusOnLoad
                    code={value}
                  />
                )}
              />
              {/* Resend code feature to be implemented soon */}
              {/* <Box row centered style={{ marginTop: wp(24) }}>
              <Text.Regular>If you didn’t receive a code! </Text.Regular>
              <TouchableOpacity>
                <Text.Regular color={colors.secondary}>Resend</Text.Regular>
              </TouchableOpacity>
            </Box> */}
              {Boolean(
                getError<RegisterVerificationInputType>(errors, "token"),
              ) && (
                <Text.Medium color={colors.danger} size={12}>
                  {getError<RegisterVerificationInputType>(errors, "token")}
                </Text.Medium>
              )}
            </Box>
            <PrimaryButton onPress={handleSubmit(onSubmit)}>
              Verify
            </PrimaryButton>
          </Box>
        </ScrollView>
      </RootLayout>
    </KeyboardAvoidingView>
  );
};

export default Verification;

const makeStyles = ({ colors, fonts }: ThemeConfig) =>
  StyleSheet.create({
    cover: {
      position: "absolute",
      zIndex: 20,
      top: 0,
      width: SCREEN_WIDTH,
      height: wp(150),
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
      marginTop: wp(150),
      paddingHorizontal: wp(PX),
      paddingVertical: wp(20),
    },
    otpRoot: {
      width: "92%",
      height: wp(50),
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    underlineStyleBase: {
      flex: 1,
      width: wp(61),
      height: wp(66),
      borderWidth: 1,
      borderRadius: 12,
      borderColor: colors.zinc,
      color: colors.night,
      fontFamily: fonts.medium,
      fontSize: wp(18),
      backgroundColor: colors.light,
    },
    underlineStyleHighLighted: {
      borderColor: colors.primary,
    },
  });
