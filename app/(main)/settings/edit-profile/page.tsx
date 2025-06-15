import UserDataForm from "@/components/user-data-form";
import { fetchEditableInfo } from "@/db/query";
import { toast } from "sonner";

export default async function EditProfilePage() {
  const result = await fetchEditableInfo();
  if (!result)
    toast.error("Error fetching data", {
      description: "Please try again later",
    });
  return (
    <div className="pt-[75px]">
      <UserDataForm
        title="Edit your profile"
        buttonTitle="Edit"
        type="edit"
        // default values
        fName={result.data?.f_name}
        lName={result.data?.l_name}
        currency={result.data?.currency}
      />
    </div>
  );
}
