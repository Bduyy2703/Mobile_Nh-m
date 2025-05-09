import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { DataTable } from "react-native-paper";

const WEBHOOK_FIELD_DESC = {
  orderCode: "Mã đơn hàng",
  amount: "Số tiền",
  description: "Mô tả lệnh chuyển khoản",
  accountNumber: "Số tài khoản nhận",
  reference: "Mã tham chiếu",
  transactionDateTime: "Thời gian",
  paymentLinkId: "Mã link thanh toán",
  code: "Mã trạng thái thanh toán",
  desc: "Mô tả trạng thái",
  counterAccountBankId: "Mã ngân hàng đối ứng",
  counterAccountBankName: "Tên ngân hàng đối ứng",
  counterAccountName: "Tên chủ tài khoản đối ứng",
  counterAccountNumber: "Số tài khoản đối ứng",
  virtualAccountName: "Tên chủ tài khoản ảo",
  virtualAccountNumber: "Số tài khoản ảo",
};

export default function PaymentFieldTable({ data }) {
  let webhookData = null;
  if (data) {
    webhookData = data;
    webhookData = Object.fromEntries(
      Object.entries(webhookData).filter(([k, v]) => {
        if (v === "" || v === undefined || k === "items") return false;
        return true;
      })
    );
  }
  return (
    <View>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title textStyle={styles.title}>
            DS các trường dữ liệu trong Webhook
          </DataTable.Title>
        </DataTable.Header>
        <DataTable.Header>
          <DataTable.Title textStyle={styles.titleCol}>Tên</DataTable.Title>
          <DataTable.Title textStyle={styles.titleCol}>Giá trị</DataTable.Title>
          <DataTable.Title textStyle={styles.titleCol}>Mô tả</DataTable.Title>
        </DataTable.Header>
        {data ? (
          Object.keys(webhookData).map((key) => (
            <DataTable.Row key={key}>
              <DataTable.Cell>{key}</DataTable.Cell>
              <DataTable.Cell>{data[key]}</DataTable.Cell>
              <DataTable.Cell>
                {WEBHOOK_FIELD_DESC[key] || ""}
              </DataTable.Cell>
            </DataTable.Row>
          ))
        ) : (
          <DataTable.Row>
            <Text style={{ textAlign: "center", width: "100%" }}>
              Không có thông tin giao dịch
            </Text>
          </DataTable.Row>
        )}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    color: "black",
  },
  titleCol: {
    color: "black",
    fontWeight: "700",
    fontSize: 14,
    paddingLeft: 20,
  },
  table: {
    padding: 0,
    borderRadius: 10,
    width: "100%",
  },
  rowColor: {
    backgroundColor: "rgb(218, 221, 225)",
  },
  col2: {
    flex: 2,
  },
});
