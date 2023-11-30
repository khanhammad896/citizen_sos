import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import React, { FC, useState } from "react";
import { z } from "zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

import { Box, RootLayout } from "@components/layout";
import Title from "@assets/media/title.svg";
import { getError, wp } from "@utils/helper";
import { useTheme } from "@hooks/use-theme";
import { ThemeConfig } from "@theme/index";
import { Text } from "@components/ui/typography";
import { Input } from "@components/ui/inputs";
import { PrimaryButton } from "@components/ui/buttons";
import { AuthScreenProps, LoginInputType } from "@utils/types";
import { useLoginMutation } from "@framework/basic-rest/auth/use-login";

import { Loader } from "@components/ui/progress";

type LoginProps = AuthScreenProps<"login">;

const validationSchema = z.object({
  contact_number: z.string().min(11, "Please enter your valid phone no"),
  password: z.string().min(1, "Please enter your password"),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Login: FC<LoginProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = makeStyles(theme);
  const { mutate: LoginAction, isPending } = useLoginMutation();
  const [showPassword, setShowPassword] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginInputType>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      contact_number: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<ValidationSchema> = (data: LoginInputType) => {
    Keyboard.dismiss();
    LoginAction(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 25 : -400}
    >
      {isPending && <Loader />}
      <RootLayout style={{ paddingHorizontal: 0 }} scrollView>
        <Box centered style={styles.root}>
          <Title width={wp(208)} height={wp(49)} />
          <Box full centered style={styles.form}>
            <Text.Regular color={colors.light} style={{ marginTop: wp(47) }}>
              Please enter your user credentials below:
            </Text.Regular>

            <Controller
              control={control}
              name="contact_number"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="03xxxxxxxxx"
                  mt={13}
                  icon="phone"
                  stroke={false}
                  value={value}
                  onChangeText={onChange}
                  errorText={getError<LoginInputType>(errors, "contact_number")}
                  errorColor="light"
                  keyboardType="number-pad"
                  maxLength={11}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange } }) => (
                <Input
                  placeholder="Password"
                  mt={13}
                  icon="lock"
                  stroke={false}
                  value={value}
                  onChangeText={onChange}
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
                  errorText={getError<LoginInputType>(errors, "password")}
                  errorColor="light"
                />
              )}
            />

            <Box full end style={{ marginVertical: wp(13) }}>
              <TouchableOpacity
                onPress={() => {
                  reset();
                  navigation.navigate("forget-password");
                }}
              >
                <Text.Regular color={colors.light} size={16}>
                  Forgot Password
                </Text.Regular>
              </TouchableOpacity>
            </Box>
            <PrimaryButton
              bgcolor={colors.success}
              radius={10}
              onPress={handleSubmit(onSubmit)}
            >
              Login
            </PrimaryButton>
          </Box>
          {/* Social login setup for future phases */}
          {/* <Box row centered style={{ marginTop: wp(69), marginBottom: wp(24) }}>
            <Box stretched style={styles.divider} />
            <Text.Medium
              color={colors.light}
              style={{ marginHorizontal: wp(10) }}
            >
              or login with
            </Text.Medium>
            <Box stretched style={styles.divider} />
          </Box> */}
          {/* <Box row>
            <TouchableOpacity>
              <PrimaryAvatar
                bgcolor="rgba(0,0,0,0.2)"
                icon={() => <Facebook width={wp(21)} height={wp(21)} />}
                stroke={false}
                size={50}
                radius={15}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <PrimaryAvatar
                bgcolor="rgba(0,0,0,0.2)"
                icon={() => <Google width={wp(21)} height={wp(21)} />}
                stroke={false}
                size={50}
                radius={15}
                style={{ marginHorizontal: wp(12) }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <PrimaryAvatar
                bgcolor="rgba(36, 20, 20, 0.2)"
                icon={() => (
                  <FontAwesomeIcon
                    icon={["fal", "fingerprint"]}
                    color={colors.light}
                    size={wp(26)}
                  />
                )}
                stroke={false}
                size={50}
                radius={15}
              />
            </TouchableOpacity>
          </Box> */}
          <Box row centered style={{ marginTop: wp(28) }}>
            <Text.Regular color={colors.light}>
              Don't have an account?{" "}
            </Text.Regular>
            <TouchableOpacity>
              <Text.Medium
                color={colors.light}
                onPress={() => navigation.navigate("register")}
              >
                Sign up
              </Text.Medium>
            </TouchableOpacity>
          </Box>
        </Box>
        <Box style={styles.disclaimer} centered justified>
          <Text.Regular color={colors.light}>Powered by</Text.Regular>
          <Text.Regular color={colors.light}>
            Islamabad Capital Territory Police
          </Text.Regular>
        </Box>
      </RootLayout>
    </KeyboardAvoidingView>
  );
};

export default Login;

const makeStyles = ({ colors }: ThemeConfig) =>
  StyleSheet.create({
    root: {
      paddingTop: wp(90),
      flex: 1,
      marginBottom: wp(50),
    },
    form: {
      maxWidth: wp(293),
    },
    divider: {
      backgroundColor: colors.light,
      opacity: 0.4,
      height: 1,
    },
    disclaimer: {
      backgroundColor: "rgba(0,0,0,0.2)",
      height: wp(72),
      width: "100%",
      borderTopRightRadius: wp(40),
      borderTopLeftRadius: wp(40),
    },
  });
