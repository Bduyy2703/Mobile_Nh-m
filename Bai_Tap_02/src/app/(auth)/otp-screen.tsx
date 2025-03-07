import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useSendOtpAsyncMutation } from "../../infrastructure/redux/apis/auth.api";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";

// Định nghĩa kiểu dữ liệu cho route.params
type OtpScreenRouteParams = {
  email: string;
};

const OtpScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<{ params: OtpScreenRouteParams }, "params">>();
    console.log(route.params)
  // Kiểm tra nếu route.params tồn tại và có email
  const email = route.params?.email ?? "";

  const [otp, setOtp] = useState("");
  const [verifyOtp, { isLoading }] = useSendOtpAsyncMutation();

  const handleVerifyOtp = async () => {
    if (!email) {
      Alert.alert("Lỗi", "Không tìm thấy email. Vui lòng thử lại!");
      return;
    }

    try {
      const response = await verifyOtp({ email, otp }).unwrap();
      Alert.alert("Thành công", "Xác minh thành công, vui lòng đăng nhập!");

      // Chuyển về màn hình đăng nhập
      navigation.navigate("SignIn" as never); // Ép kiểu để tránh lỗi TS
    } catch (error) {
      Alert.alert("Lỗi", error.data?.message || "OTP không hợp lệ!");
    }
  };

  return (
    <View>
      <Text>Nhập OTP được gửi tới email: {email}</Text>
      <TextInput
        value={otp}
        onChangeText={setOtp}
        placeholder="Nhập OTP"
        keyboardType="numeric"
      />

      <Button title={isLoading ? "Đang xác minh..." : "Xác minh"} onPress={handleVerifyOtp} disabled={isLoading} />
    </View>
  );
};

export default OtpScreen;
