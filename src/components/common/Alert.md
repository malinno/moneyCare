# Alert Component

Component Alert được thiết kế theo design system của MoneyCare, hỗ trợ nhiều loại thông báo khác nhau với giao diện đẹp và dễ sử dụng.

## Features

- ✅ 4 loại alert: `success`, `error`, `warning`, `info`
- ✅ Icon tương ứng với từng loại alert
- ✅ Hỗ trợ 1 hoặc 2 buttons
- ✅ Backdrop để đóng alert
- ✅ Animation mượt mà
- ✅ Responsive design
- ✅ TypeScript support

## Usage

### Basic Usage

```tsx
import { Alert } from "@components/common";

<Alert
  visible={true}
  type="success"
  title="Thành công!"
  message="Giao dịch đã được tạo thành công"
  primaryButtonText="OK"
  onPrimaryPress={() => console.log("OK pressed")}
  onClose={() => setVisible(false)}
/>;
```

### With useAlert Hook

```tsx
import { useAlert } from "@hooks/useAlert";
import { Alert } from "@components/common";

const MyComponent = () => {
  const { alertState, hideAlert, showSuccess, showConfirm } = useAlert();

  const handleDelete = () => {
    showConfirm("Bạn có chắc chắn muốn xóa giao dịch này?", undefined, () => {
      // Delete logic here
      showSuccess("Đã xóa thành công!");
    });
  };

  return (
    <>
      <Button title="Delete" onPress={handleDelete} />

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
      />
    </>
  );
};
```

## Props

| Prop                  | Type                                          | Default  | Description                    |
| --------------------- | --------------------------------------------- | -------- | ------------------------------ |
| `visible`             | `boolean`                                     | -        | Hiển thị/ẩn alert              |
| `type`                | `'warning' \| 'success' \| 'error' \| 'info'` | `'info'` | Loại alert                     |
| `title`               | `string`                                      | -        | Tiêu đề alert                  |
| `message`             | `string`                                      | -        | Nội dung chi tiết (optional)   |
| `primaryButtonText`   | `string`                                      | -        | Text của button chính          |
| `secondaryButtonText` | `string`                                      | -        | Text của button phụ            |
| `onPrimaryPress`      | `() => void`                                  | -        | Callback khi nhấn button chính |
| `onSecondaryPress`    | `() => void`                                  | -        | Callback khi nhấn button phụ   |
| `onClose`             | `() => void`                                  | -        | Callback khi đóng alert        |
| `showCloseButton`     | `boolean`                                     | `true`   | Cho phép đóng bằng backdrop    |

## Alert Types

### Success Alert

- **Icon**: Checkmark circle (green)
- **Use case**: Thông báo thành công
- **Example**: "Đã tạo giao dịch thành công"

### Error Alert

- **Icon**: Alert circle (red)
- **Use case**: Thông báo lỗi
- **Example**: "Có lỗi xảy ra, vui lòng thử lại"

### Warning Alert

- **Icon**: Alert circle (red)
- **Use case**: Cảnh báo, xác nhận
- **Example**: "Bạn có chắc chắn muốn xóa?"

### Info Alert

- **Icon**: Information circle (blue)
- **Use case**: Thông tin chung
- **Example**: "Tính năng sẽ được cập nhật sớm"

## useAlert Hook

Hook `useAlert` cung cấp các method tiện lợi để hiển thị alert:

### Methods

- `showAlert(config)` - Hiển thị alert với config tùy chỉnh
- `hideAlert()` - Ẩn alert
- `showSuccess(title, message?, onPress?)` - Hiển thị success alert
- `showError(title, message?, onPress?)` - Hiển thị error alert
- `showWarning(title, message?, onPress?)` - Hiển thị warning alert
- `showConfirm(title, message?, onConfirm?, onCancel?, confirmText?, cancelText?)` - Hiển thị confirm dialog

### State

- `alertState` - State hiện tại của alert (visible, type, title, etc.)

## Examples

### Confirm Delete

```tsx
const handleDelete = () => {
  showConfirm(
    "Bạn có chắc chắn muốn xóa giao dịch này?",
    undefined,
    () => {
      // Delete logic
      showSuccess("Đã xóa thành công!");
    },
    () => {
      console.log("Cancelled");
    },
    "Xóa",
    "Quay lại"
  );
};
```

### Success Notification

```tsx
const handleSuccess = () => {
  showSuccess("Bạn đã xóa thành công giao dịch", undefined, () => {
    // Navigate or refresh
  });
};
```

### Error Handling

```tsx
const handleError = () => {
  showError(
    "Có lỗi xảy ra",
    "Vui lòng kiểm tra kết nối mạng và thử lại",
    () => {
      // Retry logic
    }
  );
};
```

## Styling

Alert component sử dụng design system colors:

- Success: `COLORS.action.lima` (green)
- Error/Warning: `COLORS.action.coralRed` (red)
- Info: `COLORS.action.azureRadiance` (blue)
- Background: `COLORS.background.white`
- Text: `COLORS.text.primary` và `COLORS.text.secondary`

## Accessibility

- Modal với backdrop để đóng
- Proper focus management
- Screen reader friendly
- Touch target size >= 44px
