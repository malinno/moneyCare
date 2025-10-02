import React from "react";
import { View, StyleSheet } from "react-native";
import { Button } from "./Button";
import { Alert } from "./Alert";
import { useAlert } from "@hooks/useAlert";
import { SPACING } from "@constants/theme";

export const AlertExample: React.FC = () => {
  const {
    alertState,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  } = useAlert();

  const handleShowSuccess = () => {
    showSuccess("Bạn đã xóa thành công giao dịch", undefined, () => {
      console.log("Success alert closed");
    });
  };

  const handleShowError = () => {
    showError("Có lỗi xảy ra", "Vui lòng thử lại sau", () => {
      console.log("Error alert closed");
    });
  };

  const handleShowWarning = () => {
    showWarning(
      "Cảnh báo",
      "Bạn có chắc chắn muốn thực hiện hành động này?",
      () => {
        console.log("Warning alert closed");
      }
    );
  };

  const handleShowConfirm = () => {
    showConfirm(
      "Bạn có chắc chắn muốn xóa giao dịch này?",
      undefined,
      () => {
        console.log("Confirmed deletion");
        // Show success after confirmation
        setTimeout(() => {
          handleShowSuccess();
        }, 300);
      },
      () => {
        console.log("Cancelled deletion");
      }
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title="Show Success Alert"
        onPress={handleShowSuccess}
        variant="secondary"
        style={styles.button}
      />

      <Button
        title="Show Error Alert"
        onPress={handleShowError}
        variant="danger"
        style={styles.button}
      />

      <Button
        title="Show Warning Alert"
        onPress={handleShowWarning}
        variant="outline"
        style={styles.button}
      />

      <Button
        title="Show Confirm Dialog"
        onPress={handleShowConfirm}
        variant="primary"
        style={styles.button}
      />

      <Alert
        visible={alertState.visible}
        type={alertState.type}
        title={alertState.title}
        message={alertState.message}
        primaryButtonText={alertState.primaryButtonText}
        secondaryButtonText={alertState.secondaryButtonText}
        onPrimaryPress={alertState.onPrimaryPress}
        onSecondaryPress={alertState.onSecondaryPress}
        onClose={hideAlert}
        showCloseButton={alertState.showCloseButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  button: {
    marginBottom: SPACING.sm,
  },
});
