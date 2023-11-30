import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Box, RootLayout } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { getError, showToast, wp } from "@utils/helper";
import Cover from "@assets/media/cover.png";
import { AuthScreenProps, ForgetPasswordInputType } from "@utils/types";
import { Text } from "@components/ui/typography";
import { Input } from "@components/ui/inputs";
import { PrimaryButton } from "@components/ui/buttons";

import { useForgetPasswordMutation } from "@framework/basic-rest/auth/use-forget-password";
import { Loader } from "@components/ui/progress";
import { ScrollView } from "react-native-gesture-handler";

type RegisterProps = AuthScreenProps<"forget-password">;

const validationSchema = z.object({
  contact_number: z.string().min(11, "Please enter your valid phone no"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const ForgetPassword: FC<RegisterProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  const insets = useSafeAreaInsets();
  const { mutate: ForgetPasswordAction, isPending } =
    useForgetPasswordMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgetPasswordInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      contact_number: "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: ForgetPasswordInputType,
  ) => {
    ForgetPasswordAction(data, {
      onSuccess: (res) => {
        if (res.error)
          return showToast(
            "error",
            typeof res.error_messages === "string"
              ? res.error_messages
              : res.message,
          );
        reset();
        return navigation.navigate("reset-password", {
          contact_number: res.data.contact_number,
        });
      },
      onError: () =>
        showToast(
          "error",
          "Can't reset your password right now. Please try again!",
        ),
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
                    Forgot Password?
                  </Text.Bold>
                  <Text.Regular
                    color={colors.light}
                    style={{ maxWidth: wp(228), marginTop: wp(8) }}
                  >
                    Please provide the requested information below.
                  </Text.Regular>
                </Box>
              </Box>
            </Box>
          </ImageBackground>
        </View>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <Box stretched full style={styles.content}>
            <Box stretched>
              <Text.Medium style={{ marginBottom: wp(20) }}>
                Personal Information
              </Text.Medium>
              <Controller
                control={control}
                name="contact_number"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="03xxxxxxxxx"
                    icon="phone"
                    mt={0}
                    value={value}
                    onChangeText={onChange}
                    errorText={getError<ForgetPasswordInputType>(
                      errors,
                      "contact_number",
                    )}
                    keyboardType="number-pad"
                    maxLength={11}
                  />
                )}
              />
            </Box>

            <PrimaryButton
              style={{ marginTop: wp(24) }}
              onPress={handleSubmit(onSubmit)}
            >
              Submit
            </PrimaryButton>
          </Box>
        </ScrollView>
      </RootLayout>
    </KeyboardAvoidingView>
  );
};

export default ForgetPassword;

const makeStyles = () =>
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
  });
