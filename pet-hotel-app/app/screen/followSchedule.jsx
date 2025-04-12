import React from "react";
import { SafeAreaView, View, ScrollView, Image, Text, StyleSheet, } from "react-native";
export default (props) => {
	return (
		<SafeAreaView style={styles.container}>
			<ScrollView  style={styles.scrollView}>
				<View style={styles.row}>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={styles.image}
					/>
					<View style={styles.box}>
					</View>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={styles.image2}
					/>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={styles.image3}
					/>
					<Image
						source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
						resizeMode = {"stretch"}
						style={styles.image4}
					/>
				</View>
				<Text style={styles.text}>
					{"Theo dõi lịch\n"}
				</Text>
				<View style={styles.row2}>
					<View style={styles.column}>
						<View style={styles.view}>
							<Text style={styles.text2}>
								{"Chưa xác nhận"}
							</Text>
						</View>
						<View style={styles.absoluteBox}>
						</View>
					</View>
					<View style={styles.view2}>
						<View style={styles.column2}>
							<View style={styles.view3}>
								<Text style={styles.text3}>
									{"Xác nhận"}
								</Text>
							</View>
							<View style={styles.view4}>
								<Text style={styles.text3}>
									{"Đánh giá"}
								</Text>
							</View>
						</View>
					</View>
				</View>
				<View style={styles.column3}>
					<View style={styles.row3}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={styles.image5}
						/>
						<View style={styles.column4}>
							<View style={styles.row4}>
								<View style={styles.view5}>
									<Text style={styles.text4}>
										{"10% Off"}
									</Text>
								</View>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={styles.image6}
								/>
							</View>
							<Text style={styles.text5}>
								{"KATYB PET CARE"}
							</Text>
							<View style={styles.row5}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={styles.image7}
								/>
								<Text style={styles.text6}>
									{"Quận 9"}
								</Text>
							</View>
							<Text style={styles.text7}>
								{"150.000VND/Ngày"}
							</Text>
						</View>
						<Text style={styles.text8}>
							{"4.8"}
						</Text>
					</View>
					<View style={styles.box2}>
					</View>
					<Text style={styles.text9}>
						{"Đặt chỗ của bạn đang \nchờ được xác nhận"}
					</Text>
				</View>
				<View style={styles.column5}>
					<View style={styles.row3}>
						<Image
							source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
							resizeMode = {"stretch"}
							style={styles.image5}
						/>
						<View style={styles.column4}>
							<View style={styles.row6}>
								<View style={styles.view6}>
									<Text style={styles.text4}>
										{"10% Off"}
									</Text>
								</View>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={styles.image6}
								/>
							</View>
							<Text style={styles.text5}>
								{"KATYB PET CARE"}
							</Text>
							<View style={styles.row5}>
								<Image
									source = {{uri: "https://i.imgur.com/1tMFzp8.png"}} 
									resizeMode = {"stretch"}
									style={styles.image7}
								/>
								<Text style={styles.text6}>
									{"Quận 9"}
								</Text>
							</View>
							<Text style={styles.text7}>
								{"150.000VND/Ngày"}
							</Text>
						</View>
						<Text style={styles.text10}>
							{"4.8"}
						</Text>
					</View>
					<View style={styles.box3}>
					</View>
					<Text style={styles.text9}>
						{"Đặt chỗ của bạn đang \nchờ được xác nhận"}
					</Text>
				</View>
				<View style={styles.box4}>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#FFFFFF",
	},
	absoluteBox: {
		position: "absolute",
		bottom: -2,
		left: -4,
		width: 105,
		height: 4,
		backgroundColor: "#0A5472",
		borderRadius: 15,
	},
	box: {
		flex: 1,
		alignSelf: "stretch",
	},
	box2: {
		width: 303,
		height: 1,
		backgroundColor: "#000000",
		marginBottom: 13,
		marginHorizontal: 18,
	},
	box3: {
		width: 303,
		height: 1,
		backgroundColor: "#000000",
		marginBottom: 12,
		marginHorizontal: 18,
	},
	box4: {
		width: 135,
		height: 6,
		backgroundColor: "#C3D7DD",
		borderRadius: 10,
		marginHorizontal: 121,
	},
	column: {
		width: 123,
	},
	column2: {
		flex: 1,
	},
	column3: {
		backgroundColor: "#FFFFFF",
		borderColor: "#DADADA",
		borderRadius: 15,
		borderWidth: 1,
		paddingVertical: 21,
		marginBottom: 48,
		marginHorizontal: 20,
	},
	column4: {
		width: 121,
		alignSelf: "flex-start",
		marginTop: 24,
		marginRight: 2,
	},
	column5: {
		backgroundColor: "#FFFFFF",
		borderColor: "#DADADA",
		borderRadius: 15,
		borderWidth: 1,
		paddingVertical: 21,
		marginBottom: 123,
		marginHorizontal: 20,
	},
	image: {
		width: 28,
		height: 12,
	},
	image2: {
		width: 17,
		height: 10,
		marginRight: 5,
	},
	image3: {
		width: 15,
		height: 10,
		marginRight: 5,
	},
	image4: {
		width: 24,
		height: 11,
	},
	image5: {
		borderRadius: 12,
		width: 157,
		height: 133,
		marginRight: 12,
	},
	image6: {
		width: 12,
		height: 12,
	},
	image7: {
		width: 11,
		height: 16,
		marginRight: 8,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 29,
		marginHorizontal: 24,
	},
	row2: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 29,
		marginHorizontal: 24,
	},
	row3: {
		flexDirection: "row",
		marginBottom: 19,
		marginHorizontal: 12,
	},
	row4: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	row5: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 11,
		marginHorizontal: 1,
	},
	row6: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 7,
	},
	scrollView: {
		flex: 1,
		backgroundColor: "#FDFBF6",
		paddingTop: 16,
	},
	text: {
		color: "#4EA0B7",
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 23,
		marginLeft: 122,
	},
	text2: {
		color: "#0A5472",
		fontSize: 15,
		fontWeight: "bold",
	},
	text3: {
		color: "#000000",
		fontSize: 15,
	},
	text4: {
		color: "#4EA0B7",
		fontSize: 10,
		fontWeight: "bold",
	},
	text5: {
		color: "#000000",
		fontSize: 14,
		fontWeight: "bold",
		marginBottom: 7,
		marginLeft: 2,
	},
	text6: {
		color: "#AEACAC",
		fontSize: 10,
		fontWeight: "bold",
		flex: 1,
	},
	text7: {
		color: "#000000",
		fontSize: 12,
		fontWeight: "bold",
		marginLeft: 5,
	},
	text8: {
		color: "#4EA0B7",
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 30,
		flex: 1,
	},
	text9: {
		color: "#4EA0B7",
		fontSize: 18,
		fontWeight: "bold",
		textAlign: "center",
		marginHorizontal: 87,
		width: 174,
	},
	text10: {
		color: "#4EA0B7",
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 29,
		flex: 1,
	},
	view: {
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		paddingVertical: 22,
		paddingHorizontal: 4,
	},
	view2: {
		width: 205,
		flexDirection: "row",
		alignItems: "center",
	},
	view3: {
		width: 105,
		height: 50,
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		paddingVertical: 19,
	},
	view4: {
		width: 105,
		height: 50,
		backgroundColor: "#FFFFFF",
		borderRadius: 15,
		paddingVertical: 19,
		paddingLeft: 35,
		paddingRight: 13,
	},
	view5: {
		width: 43,
		alignItems: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 2,
		paddingVertical: 5,
	},
	view6: {
		width: 43,
		alignItems: "center",
		backgroundColor: "#FFF5F0",
		borderRadius: 2,
		paddingVertical: 4,
	},
});