import { useState, useCallback } from "react";

interface AlertConfig {
  type?: "warning" | "success" | "error" | "info";
  title: string;
  message?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
  showCloseButton?: boolean;
}

interface AlertState extends AlertConfig {
  visible: boolean;
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>({
    visible: false,
    title: "",
  });

  const showAlert = useCallback((config: AlertConfig) => {
    setAlertState({
      ...config,
      visible: true,
    });
  }, []);

  const hideAlert = useCallback(() => {
    setAlertState((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Convenience methods for different alert types
  const showSuccess = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "success",
        title,
        message,
        primaryButtonText: "OK",
        onPrimaryPress: onPress,
      });
    },
    [showAlert]
  );

  const showError = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "error",
        title,
        message,
        primaryButtonText: "OK",
        onPrimaryPress: onPress,
      });
    },
    [showAlert]
  );

  const showWarning = useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        type: "warning",
        title,
        message,
        primaryButtonText: "OK",
        onPrimaryPress: onPress,
      });
    },
    [showAlert]
  );

  const showConfirm = useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      onCancel?: () => void,
      confirmText: string = "Xóa",
      cancelText: string = "Quay lại"
    ) => {
      showAlert({
        type: "warning",
        title,
        message,
        primaryButtonText: confirmText,
        secondaryButtonText: cancelText,
        onPrimaryPress: onConfirm,
        onSecondaryPress: onCancel,
      });
    },
    [showAlert]
  );

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showConfirm,
  };
};
