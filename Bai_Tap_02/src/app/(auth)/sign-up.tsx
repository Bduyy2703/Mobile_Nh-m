import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRegisterAsyncMutation } from "../../infrastructure/redux/apis/auth.api";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";

// Định nghĩa kiểu dữ liệu cho navigation
type RootStackParamList = {
  OtpScreen: { email: string };
  SignIn: undefined;
};

const SignUp = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerAsync, { isLoading }] = useRegisterAsyncMutation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu không khớp");
      return;
    }

    try {
      await registerAsync({ email, password, confirmPassword }).unwrap();
      Alert.alert("Thành công", "Vui lòng nhập OTP để xác minh tài khoản.");

      // Chuyển sang màn hình OTP, truyền email để xác minh
      router.push({ pathname: "/otp-screen", params: { email } });

    } catch (error) {
      Alert.alert("Lỗi", error.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <View>
      <Text>Email</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Nhập email" />

      <Text>Mật khẩu</Text>
      <TextInput value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" secureTextEntry />

      <Text>Xác nhận mật khẩu</Text>
      <TextInput value={confirmPassword} onChangeText={setConfirmPassword} placeholder="Nhập lại mật khẩu" secureTextEntry />

      <Button title={isLoading ? "Đang đăng ký..." : "Đăng ký"} onPress={handleSignUp} disabled={isLoading} />

      {/* Nút quay lại đăng nhập */}
      <Button title="Quay lại đăng nhập" onPress={() => router.push("/sign-in")} />
    </View>
  );
};

export default SignUp;
