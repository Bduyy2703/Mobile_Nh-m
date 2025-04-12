import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { PaperProvider } from "react-native-paper";
import TransferInfo from "../../components/Payment/TransferInfo";
import Header from "../../components/Header/header";
import { commonStyles } from "../../style";

const Payment = () => {
  const router = useRouter();
  const { accountName, accountNumber, amount, bin, description, qrCode, orderCode, paymentLinkId } = useLocalSearchParams();


  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <PaperProvider>
        <SafeAreaView style={commonStyles.container}>
          <Header title={"Thanh toán"} />
          <View>
            <TransferInfo
              accountName={accountName}
              accountNumber={accountNumber}
              amount={amount}
              bin={bin}
              description={description}
              qrCode={qrCode}
              orderCode={orderCode}
              paymentLinkId={paymentLinkId}
            />
          </View>
        </SafeAreaView>
      </PaperProvider>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default Payment;
