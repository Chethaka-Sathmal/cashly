export default function formatDate(
  input: string | Date,
  format: "dd-mm-yyyy" | "yyyy-mm-dd" = "dd-mm-yyyy"
) {
  const date = new Date(input);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 0-indexed
  const year = date.getFullYear();

  if (format === "yyyy-mm-dd") {
    return `${year}-${month}-${day}`;
  }

  return `${day}-${month}-${year}`;
}
