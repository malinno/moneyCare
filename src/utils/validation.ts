import * as yup from "yup";

// Common validation rules
export const validationRules = {
  required: (message: string = "Trường này là bắt buộc") =>
    yup.string().required(message),

  email: (message: string = "Email không hợp lệ") =>
    yup.string().email(message).required("Email là bắt buộc"),

  password: (
    minLength: number = 8,
    message: string = `Mật khẩu phải có ít nhất ${minLength} ký tự`
  ) =>
    yup
      .string()
      .min(minLength, message)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường và 1 số"
      )
      .required("Mật khẩu là bắt buộc"),

  confirmPassword: (message: string = "Mật khẩu xác nhận không khớp") =>
    yup
      .string()
      .oneOf([yup.ref("password")], message)
      .required("Xác nhận mật khẩu là bắt buộc"),

  phone: (message: string = "Số điện thoại không hợp lệ") =>
    yup
      .string()
      .matches(/^[0-9+\-\s()]+$/, message)
      .min(10, "Số điện thoại phải có ít nhất 10 số")
      .max(15, "Số điện thoại không được quá 15 số"),

  number: (
    min?: number,
    max?: number,
    message: string = "Giá trị không hợp lệ"
  ) => {
    let schema = yup.number().typeError("Phải là một số");

    if (min !== undefined) {
      schema = schema.min(min, `Giá trị phải lớn hơn hoặc bằng ${min}`);
    }

    if (max !== undefined) {
      schema = schema.max(max, `Giá trị phải nhỏ hơn hoặc bằng ${max}`);
    }

    return schema.required(message);
  },

  positiveNumber: (message: string = "Giá trị phải lớn hơn 0") =>
    yup
      .number()
      .typeError("Phải là một số")
      .positive(message)
      .required("Trường này là bắt buộc"),

  amount: (
    min: number = 0,
    max: number = 999999999,
    message: string = "Số tiền không hợp lệ"
  ) =>
    yup
      .number()
      .typeError("Phải là một số")
      .min(min, `Số tiền phải lớn hơn hoặc bằng ${min.toLocaleString()}`)
      .max(max, `Số tiền không được vượt quá ${max.toLocaleString()}`)
      .required("Số tiền là bắt buộc"),

  date: (message: string = "Ngày không hợp lệ") =>
    yup.date().typeError(message).required("Ngày là bắt buộc"),

  dateRange: (
    startDate?: Date,
    endDate?: Date,
    message: string = "Ngày không hợp lệ"
  ) => {
    let schema = yup.date().typeError(message);

    if (startDate) {
      schema = schema.min(startDate, "Ngày không được nhỏ hơn ngày bắt đầu");
    }

    if (endDate) {
      schema = schema.max(endDate, "Ngày không được lớn hơn ngày kết thúc");
    }

    return schema.required("Ngày là bắt buộc");
  },

  select: (message: string = "Vui lòng chọn một tùy chọn") =>
    yup.string().required(message),

  multiSelect: (
    minItems: number = 1,
    message: string = `Vui lòng chọn ít nhất ${minItems} mục`
  ) => yup.array().min(minItems, message).required("Trường này là bắt buộc"),

  url: (message: string = "URL không hợp lệ") => yup.string().url(message),

  minLength: (
    length: number,
    message: string = `Phải có ít nhất ${length} ký tự`
  ) => yup.string().min(length, message),

  maxLength: (
    length: number,
    message: string = `Không được vượt quá ${length} ký tự`
  ) => yup.string().max(length, message),

  alphanumeric: (message: string = "Chỉ được chứa chữ cái và số") =>
    yup.string().matches(/^[a-zA-Z0-9]+$/, message),

  noSpecialChars: (message: string = "Không được chứa ký tự đặc biệt") =>
    yup.string().matches(/^[a-zA-Z0-9\s]+$/, message),
};

// Pre-built schemas for common forms
export const schemas = {
  // Login form
  login: yup.object().shape({
    email: validationRules.email(),
    password: yup.string().required("Mật khẩu là bắt buộc"),
    rememberMe: yup.boolean(),
  }),

  // Register form
  register: yup.object().shape({
    firstName: validationRules
      .required("Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    lastName: validationRules
      .required("Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự"),
    email: validationRules.email(),
    password: validationRules.password(),
    confirmPassword: validationRules.confirmPassword(),
    phoneNumber: validationRules.phone().optional(),
    agreeToTerms: yup
      .boolean()
      .oneOf([true], "Bạn phải đồng ý với điều khoản sử dụng"),
  }),

  // Transaction form
  transaction: yup.object().shape({
    type: validationRules.select("Vui lòng chọn loại giao dịch"),
    amount: validationRules.amount(1),
    categoryId: validationRules.select("Vui lòng chọn danh mục"),
    description: yup.string().max(500, "Mô tả không được vượt quá 500 ký tự"),
    date: validationRules.date(),
    accountId: yup.string(),
    tags: yup.array().of(yup.string()),
  }),

  // Budget form
  budget: yup.object().shape({
    name: validationRules
      .required("Tên ngân sách là bắt buộc")
      .max(100, "Tên không được vượt quá 100 ký tự"),
    amount: validationRules.amount(1),
    period: validationRules.select("Vui lòng chọn chu kỳ"),
    categoryIds: validationRules.multiSelect(
      1,
      "Vui lòng chọn ít nhất 1 danh mục"
    ),
    startDate: validationRules.date(),
  }),

  // Profile form
  profile: yup.object().shape({
    firstName: validationRules
      .required("Tên là bắt buộc")
      .min(2, "Tên phải có ít nhất 2 ký tự"),
    lastName: validationRules
      .required("Họ là bắt buộc")
      .min(2, "Họ phải có ít nhất 2 ký tự"),
    email: validationRules.email(),
    phoneNumber: validationRules.phone().optional(),
    dateOfBirth: validationRules.date().optional(),
    currency: validationRules.select("Vui lòng chọn đơn vị tiền tệ"),
  }),

  // Change password form
  changePassword: yup.object().shape({
    currentPassword: yup.string().required("Mật khẩu hiện tại là bắt buộc"),
    newPassword: validationRules.password(),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref("newPassword")], "Mật khẩu xác nhận không khớp")
      .required("Xác nhận mật khẩu mới là bắt buộc"),
  }),

  // Forgot password form
  forgotPassword: yup.object().shape({
    email: validationRules.email(),
  }),

  // Reset password form
  resetPassword: yup.object().shape({
    token: yup.string().required("Mã xác thực là bắt buộc"),
    newPassword: validationRules.password(),
    confirmPassword: validationRules.confirmPassword(),
  }),
};

// Validation helper functions
export const validateField = async (
  schema: yup.AnySchema,
  value: any
): Promise<{ isValid: boolean; error?: string }> => {
  try {
    await schema.validate(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return { isValid: false, error: error.message };
    }
    return { isValid: false, error: "Validation error" };
  }
};

export const validateForm = async (
  schema: yup.ObjectSchema<any>,
  data: any
): Promise<{ isValid: boolean; errors?: Record<string, string> }> => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true };
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: { general: "Validation error" } };
  }
};
