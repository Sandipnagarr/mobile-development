import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // Search bar overlay
  search: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    height: 45,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 5, // Android shadow
  },

  showButton: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#2877ee",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 5,
  },
  showButtonyoutube:{
    position: "absolute",
    top: 70,
    left: 20,
    backgroundColor: "#202224",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 5,
  },

  showButtonText: {
    color: "white",
    fontWeight: "600",
  },

  tableWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
    maxHeight: 260,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 10,
    padding: 12,
    elevation: 6,
  },

  tableTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  tableTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e8f0ff",
    borderWidth: 1,
    borderColor: "#cfd8e3",
  },

  tableBody: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cfd8e3",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cfd8e3",
  },

  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    color: "#222",
    fontSize: 13,
  },

  headerCell: {
    fontWeight: "700",
  },

  locationImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
    alignSelf: "center",
  },

  imagePlaceholder: {
    textAlign: "center",
    color: "#222",
    fontSize: 13,
  },

  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  previewImage: {
    width: "100%",
    height: "75%",
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#292727",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});
export default styles;