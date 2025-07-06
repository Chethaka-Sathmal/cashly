export default function formatDate(
  input: string | Date,
  format: "dd-mm-yyyy" | "yyyy-mm-dd" = "yyyy-mm-dd"
) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const year = date.getFullYear();

  if (format === "dd-mm-yyyy") {
    return `${day}-${month}-${year}`;
  }

  return `${year}-${month}-${day}`;
}
