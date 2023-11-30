import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { FC, useState } from "react";
import { Box, RootLayout } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { getError, showToast, wp } from "@utils/helper";
import Cover from "@assets/media/cover.png";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { AuthScreenProps, ResetPasswordInputType } from "@utils/types";
import { Text } from "@components/ui/typography";
import { Input } from "@components/ui/inputs";
import { PrimaryButton } from "@components/ui/buttons";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPasswordMutation } from "@framework/basic-rest/auth/use-reset-password";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { ThemeConfig } from "@theme/index";
import { Loader } from "@components/ui/progress";
import Timer from "@components/timer";
import { useForgetPasswordMutation } from "@framework/basic-rest/auth/use-forget-password";

type RegisterProps = AuthScreenProps<"reset-password">;

const validationSchema = z
  .object({
    token: z.string().min(4, "Please enter the OTP"),
    contact_number: z.string().min(11, "Please enter your valid phone no"),
    password: z.string().min(1, "Please enter your new password"),
    password_confirmation: z
      .string()
      .min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type ValidationSchema = z.infer<typeof validationSchema>;

const ResetPassword: FC<RegisterProps> = ({ navigation, route }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const { mutate: ResetPasswordAction, isPending } = useResetPasswordMutation();
  const { mutate: ForgetPassword } = useForgetPasswordMutation();
  const { contact_number } = route.params;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    resetField,
  } = useForm<ResetPasswordInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      token: "",
      contact_number,
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: ResetPasswordInputType,
  ) => {
    ResetPasswordAction(data, {
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
        showToast("success", "Your password has been reset.");
        reset();
        return navigation.navigate("login");
      },
      onError: () =>
        showToast(
          "error",
          "Can't reset your password right now. Please try again!",
        ),
    });
  };

  const handleResend = () => {
    ForgetPassword({ contact_number });
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
                    Reset Password
                  </Text.Bold>
                  <Text.Regular
                    color={colors.light}
                    style={{ maxWidth: wp(228), marginTop: wp(8) }}
                  >
                    Set your new password.
                  </Text.Regular>
                </Box>
              </Box>
            </Box>
          </ImageBackground>
        </View>
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Box stretched full style={styles.content}>
            <Box full stretched style={{ marginBottom: wp(30) }}>
              <Box full centered style={styles.otpContainer}>
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
                      autoFocusOnLoad
                      onCodeChanged={onChange}
                      code={value}
                    />
                  )}
                />
                <Timer handleResend={handleResend} />
                {Boolean(getError<ResetPasswordInputType>(errors, "token")) && (
                  <Text.Medium color={colors.danger} size={12}>
                    {getError<ResetPasswordInputType>(errors, "token")}
                  </Text.Medium>
                )}
              </Box>
              <Text.Medium style={{ marginVertical: wp(20) }}>
                New Password
              </Text.Medium>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="New Password"
                    icon="lock"
                    mt={0}
                    endAdornment={() => (
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                      >
                        <FontAwesomeIcon
                          color={colors.zinc}
                          icon={["fal", showPassword ? "eye" : "eye-slash"]}
                        />
                      </TouchableOpacity>
                    )}
                    secureTextEntry={showPassword}
                    value={value}
                    onChangeText={onChange}
                    errorText={getError<ResetPasswordInputType>(
                      errors,
                      "password",
                    )}
                  />
                )}
              />
              <Controller
                control={control}
                name="password_confirmation"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Confirm New Password"
                    icon="lock"
                    endAdornment={() => (
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((prev) => !prev)}
                      >
                        <FontAwesomeIcon
                          color={colors.zinc}
                          icon={[
                            "fal",
                            showConfirmPassword ? "eye" : "eye-slash",
                          ]}
                        />
                      </TouchableOpacity>
                    )}
                    secureTextEntry={showConfirmPassword}
                    value={value}
                    onChangeText={onChange}
                    errorText={getError<ResetPasswordInputType>(
                      errors,
                      "password_confirmation",
                    )}
                  />
                )}
              />
            </Box>

            <PrimaryButton onPress={handleSubmit(onSubmit)}>
              Submit
            </PrimaryButton>
          </Box>
        </ScrollView>
      </RootLayout>
    </KeyboardAvoidingView>
  );
};

export default ResetPassword;

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
    otpContainer: {
      marginVertical: wp(36),
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
