// useUserData.ts
import { useEffect, useState } from "react";
import { useFetchUserData } from "../../../modules/user/services/user-services"; // Adjust the path as needed
import Cookies from "js-cookie";

const useUserData = () => {
  const token = Cookies.get("userToken");
  const { fetchUserData, data, loading, error } = useFetchUserData();
  const [profileImage, setProfileImage] = useState<string | undefined>("/profile.svg");
  const [userData, setUserData] = useState<any>(null); // Adjust the type as needed
  const [hasFetched, setHasFetched] = useState(false); // State to track if data has been fetched

  useEffect(() => {
    // Fetch user data only if there is a token and it hasn't been fetched yet
    if (token && !hasFetched) {
      fetchUserData(token);
      setHasFetched(true); // Set the flag to indicate fetching has occurred
    }
  }, [token, fetchUserData, hasFetched]);

  useEffect(() => {
    if (data && data.getUser && data.getUser.data) {
      const userDetails = data.getUser.data;
      setUserData(userDetails); // Set the entire user data
      setProfileImage(userDetails.profileImage ?? undefined); // Set the profile image
    }
  }, [data]);

  return { profileImage, userData, loading, error }; // Return profileImage, userData, loading, error
};

export default useUserData;
