import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../authentication/firebase";
import useUserDetails from "./useUserDetails";

const useSaveTopics = () => {
  const [isSaving, setIsSaving] = useState(false);  
  const [saveError, setSaveError] = useState(null); 
  const [saveSuccess, setSaveSuccess] = useState(null);

  const {userDetails} = useUserDetails();

  const saveTopicsToProfile = async (selectedTopics) => {
    if (!userDetails) {
      setSaveError("You need to be logged in to save topics.");
      return;
    }

    if (selectedTopics.length === 0) {
      setSaveError("No topics selected.");
      setSaveSuccess(null);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Save topics to the Firestore under the user's uid
      await setDoc(
        doc(db, "users", userDetails.uid),
        { topics: selectedTopics },
        { merge: true }  // Ensures only the topics field is updated without overwriting other user data
      );
      setIsSaving(false);
      setSaveSuccess("Topics saved to your profile!");
    } catch (error) {
      console.error("Error saving topics: ", error);
      setSaveError("Failed to save topics. Please try again.");
      setIsSaving(false);
      setSaveSuccess(null);
    }
  };

  return {
    saveTopicsToProfile,
    isSaving,
    saveError,
    saveSuccess
  };
};

export default useSaveTopics;
