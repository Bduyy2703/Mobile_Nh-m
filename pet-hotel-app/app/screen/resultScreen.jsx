import { useRoute } from "@react-navigation/native";
import { StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import API from "../../config/AXIOS_API";
import OrderTable from "../../components/Payment/OrderTable";
import PaymentFieldTable from "../../components/Payment/PaymentFieldTable";
import { commonStyles } from '../../style';

export default function ResultScreen() {
  const navigation = useNavigation();
  const [order, setOrder] = useState();
  const route = useRoute();
  const [searchParams] = useSearchParams();
  const query = searchParams.query; // Lấy giá trị của query

  useEffect(() => {
    (async () => {
      try {
        let orderCode = route.params.orderCode;
        if (!orderCode) return;
        let res = await API.get(`/payment/${orderCode}`);
        if (res.error === undefined) throw new Error("Không thể kết nối đến server");
        if (res.error !== 0) throw new Error(res.message);
        console.log(res);
        setOrder(res.data);
      } catch (error) {
        Alert.alert(error.message);
      }
    })();
  }, []);

  return (
    <ScrollView
      bounces={false}
      alwaysBounceVertical={false}
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView style={styles.innerContainer}>
        <OrderTable data={order} />
        <PaymentFieldTable data={order?.webhook_snapshot?.data} />
      </SafeAreaView>
      {/* <Button mode="text" onPress={() => navigation.navigate("Demo")} style={styles.button}> */}
      <Button mode="text" onPress={() => handleSearch} style={styles.button}>
        Quay về
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    alignSelf: "center",
  },
  innerContainer: {
    gap: 20,
  },
  button: {
    width: 200,
    alignSelf: "center",
    margin: 20,
  },
});
