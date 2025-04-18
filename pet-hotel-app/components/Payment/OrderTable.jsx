import { StyleSheet, Text, View } from "react-native";
import { DataTable } from "react-native-paper";

export default function OrderTable({ data }) {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        Đơn hàng{" "}
        <Text style={{ fontWeight: "600" }}>
          {data?.id ? `#${data.id}` : "không tìm thấy"}{" "}
        </Text>
        {data?.status
          ? data.status === "PAID"
            ? ` đã thanh toán thành công`
            : ` chưa được thanh toán`
          : ""}
      </Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title textStyle={styles.title}>
            Mô tả đơn hàng
          </DataTable.Title>
        </DataTable.Header>
        {data?.id === undefined ? (
          <DataTable.Row>
            <Text style={{ textAlign: "center", width: "100%" }}>
              Không có thông tin đơn hàng
            </Text>
          </DataTable.Row>
        ) : (
          <>
            <DataTable.Row>
              <DataTable.Cell>Mã đơn hàng</DataTable.Cell>
              <DataTable.Cell style={styles.col2}>
                <Text style={{ fontWeight: "700" }}>#{data.id}</Text>
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row style={styles.rowColor}>
              <DataTable.Cell>Trạng thái</DataTable.Cell>
              <DataTable.Cell style={styles.col2}>
                {data["status"] === "PAID" ? "Đã thanh toán" : "Chưa thanh toán"}
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row style={{ height: 80 }}>
              <DataTable.Cell>Sản phẩm</DataTable.Cell>
              <DataTable.Cell style={styles.col2}>
                <View style={{ flexDirection: "column" }}>
                  <Text numberOfLines={1}>
                    Tên sản phẩm: {data["items"][0]["name"]}
                  </Text>
                  <Text numberOfLines={1}>
                    Số lượng: {data["items"][0]["quantity"]}
                  </Text>
                  <Text numberOfLines={1}>
                    Đơn giá: {data["items"][0]["price"]} VNĐ
                  </Text>
                </View>
              </DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row style={styles.rowColor}>
              <DataTable.Cell>Tổng tiền</DataTable.Cell>
              <DataTable.Cell style={styles.col2}>
                {data["amount"]} VNĐ
              </DataTable.Cell>
            </DataTable.Row>
          </>
        )}
      </DataTable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
  },
  header: {
    textAlign: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    color: "black",
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
