import UserDataFrom from "@/components/user-data-form";

export default function OnboardingPage() {
  return (
    <UserDataFrom
      title="Welcome aboard"
      subTittle="Let's get you started"
      buttonTitle="Finish"
      type="create"
    />
  );
}
