import * as Yup from "yup";

export const consultationSchema = Yup.object({
  firstName: Yup.string().required("First name is required").max(100, "First name must be under 100 characters"),
  lastName: Yup.string().required("Last name is required").max(100, "Last name must be under 100 characters"),
  reason: Yup.string().required("Reason for consultation is required").max(500, "Reason must be under 500 characters"),
  datetime: Yup.string()
    .required("Date and time is required")
    .test("is-future", "Date and time must be in the future",
      (value) => {
        if (!value) return false;
        return new Date(value) > new Date();
      }
    ),
});
