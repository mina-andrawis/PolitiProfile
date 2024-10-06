import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const useSaveTopics = () => {
  const [isSaving, setIsSaving] = useState(false);  
  const [saveError, setSaveError] = useState(null); 

  const saveTopicsToProfile = async (user, selectedTopics) => {
    if (!user) {
      setSaveError("You need to be logged in to save topics.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      // Save topics to the Firestore under the user's uid
      await setDoc(
        doc(db, "users", user.uid),
        { topics: selectedTopics },
        { merge: true }  // Ensures only the topics field is updated without overwriting other user data
      );
      setIsSaving(false);
      alert("Topics saved to your profile!");
    } catch (error) {
      console.error("Error saving topics: ", error);
      setSaveError("Failed to save topics. Please try again.");
      setIsSaving(false);
    }
  };

  return {
    saveTopicsToProfile,
    isSaving,
    saveError
  };
};

export default useSaveTopics;
