import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React, { FC, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { z } from "zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Box, RootLayout } from "@components/layout";
import { useTheme } from "@hooks/use-theme";
import { PX, SCREEN_WIDTH } from "@utils/constants";
import { getError, showToast, wp } from "@utils/helper";
import Cover from "@assets/media/cover.png";
import { AuthScreenProps, RegisterInputType } from "@utils/types";
import { Text } from "@components/ui/typography";
import { Input } from "@components/ui/inputs";
import { PrimaryButton } from "@components/ui/buttons";
import { useRegisterMutation } from "@framework/basic-rest/auth/use-register";
import { Loader } from "@components/ui/progress";

type RegisterProps = AuthScreenProps<"register">;

const validationSchema = z
  .object({
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
    password: z.string().min(1, "Please enter your password"),
    password_confirmation: z
      .string()
      .min(1, "Please enter your password again"),
    cnic: z.string().min(13, "Please enter valid CNIC"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "Passwords do not match",
  });

type ValidationSchema = z.infer<typeof validationSchema>;

const Register: FC<RegisterProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const { mutate: RegisterAction, isPending } = useRegisterMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      contact_number: "",
      password: "",
      password_confirmation: "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (
    data: RegisterInputType,
  ) => {
    RegisterAction(data, {
      onSuccess: (res) => {
        if (res.error)
          return showToast(
            "error",
            typeof res.error_messages === "string"
              ? res.error_messages
              : res.message,
          );
        reset();
        return navigation.navigate("verification", {
          user_id: res.data.user_id,
          contact_number: data.contact_number,
        });
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
      <RootLayout cover={false} safe={false}>
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
                    Register
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
        <ScrollView
          style={{ width: "100%" }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <Box full stretched style={styles.content}>
            <Box full stretched>
              <Text.Medium style={{ marginBottom: wp(20) }}>
                Personal Information
              </Text.Medium>
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
                    errorText={getError<RegisterInputType>(
                      errors,
                      "first_name",
                    )}
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
                    errorText={getError<RegisterInputType>(errors, "last_name")}
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
                    errorText={getError<RegisterInputType>(
                      errors,
                      "contact_number",
                    )}
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
                    icon="user"
                    value={value}
                    onChangeText={onChange}
                    errorText={getError<RegisterInputType>(errors, "email")}
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
                    errorText={getError<RegisterInputType>(errors, "email")}
                    keyboardType="number-pad"
                    maxLength={13}
                  />
                )}
              />
              <Text.Medium style={{ marginVertical: wp(20) }}>
                Password
              </Text.Medium>
              <Controller
                control={control}
                name="password"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Password"
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
                    errorText={getError<RegisterInputType>(errors, "password")}
                  />
                )}
              />
              <Controller
                control={control}
                name="password_confirmation"
                render={({ field: { value, onChange } }) => (
                  <Input
                    placeholder="Confirm Password"
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
                    errorText={getError<RegisterInputType>(
                      errors,
                      "password_confirmation",
                    )}
                  />
                )}
              />
            </Box>
            <PrimaryButton
              style={{ marginTop: wp(24) }}
              onPress={handleSubmit(onSubmit)}
            >
              Register
            </PrimaryButton>
          </Box>
        </ScrollView>
      </RootLayout>
    </KeyboardAvoidingView>
  );
};

export default Register;

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
      paddingTop: wp(20),
      paddingBottom: wp(20),
    },
  });
