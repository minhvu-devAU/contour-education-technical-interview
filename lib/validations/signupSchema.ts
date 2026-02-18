import * as Yup from "yup";

export const signupSchema = Yup.object({
  firstName: Yup.string()
    .required("First name is required")
    .max(100, "First name must be under 100 characters")
    .matches(/^[^\d]*$/, "Must not contain numbers"),
  lastName: Yup.string()
    .required("Last name is required")
    .max(100, "Last name must be under 100 characters")
    .matches(/^[^\d]*$/, "Must not contain numbers"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phone: Yup.string()
    .required("Phone number is required")
    .matches(
      /^\+?[0-9\s\-()]{7,15}$/,
      "Please enter a valid phone number"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /[a-z]/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /[0-9]/,
      "Password must contain at least one number"
    )
    .matches(
      /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/~]/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
});
