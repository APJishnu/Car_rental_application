import { gql, useLazyQuery ,useMutation } from "@apollo/client";
interface User {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  profileImage?:string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
}

interface UserResponse {
  status: string;
  message: string;
  data: User | null; // `data` can be null if the user is not found
}
interface FieldError {
  field: string;
  message: string;
}

interface GetUserResponse {
  getUser: UserResponse;
}



// Updated GraphQL query to include status, message, and data
const GET_USER = gql`
  query GetUser {
    getUser {
      status
      message
      data {
        id
        firstName
        lastName
        phoneNumber
        email
        profileImage
        city
        state
        country
        pincode
      }
    }
  }
`;


const UPDATE_PROFILE_IMAGE = gql`
mutation UpdateProfileImage($userId: ID!, $profileImage:Upload) {
  updateProfileImage(userId: $userId, profileImage: $profileImage) {
    status
    message
  }
}
`
// GraphQL mutation for updating user profile
const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfo(
    $userId: ID!
    $firstName: String
    $lastName: String
    $email: String
    $city: String
    $state: String
    $country: String
    $pincode: String
  ) {
    updateUserInfo(
      userId: $userId
      firstName: $firstName
      lastName: $lastName
      email: $email
      city: $city
      state: $state
      country: $country
      pincode: $pincode
    ) {
      status
      statusCode
      message
      data {
        id
        firstName
        lastName
        email
        phoneNumber
        profileImage
        city
        state
        country
        pincode
      }
       fieldErrors {
        field
        message
      }
    }
  }
`;





// Define the function to fetch user data using Apollo Client's useLazyQuery
export const useFetchUserData = () => {
  const [getUser, { loading, data, error }] = useLazyQuery<GetUserResponse>(GET_USER);

  const fetchUserData = async (token: string): Promise<UserResponse | null> => {
    try {
      // Call the getUser query with token passed in headers (Authorization)
      const result = await getUser({
        context: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      console.log(result.data?.getUser)

      return result.data?.getUser || null;
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw new Error("Could not fetch user data.");
    }
  };

  return {
    fetchUserData,
    loading,
    data,
    error,
  };
};




// Custom hook for updating profile image
export const useUpdateProfileImage = () => {
  const [updateProfileImage, { loading, error }] = useMutation(UPDATE_PROFILE_IMAGE);
  
  const update = async ({ userId, profileImage }: { userId: string; profileImage: File | null }) => {

    console.log("Updating profile image:", profileImage); // Log the profile image to see what is being passed
    return updateProfileImage({
      variables: {
        userId,
        profileImage,
      },
    });
  };

  return {
    updateProfileImage: update,
    loading,
    error,
  };
};


// Custom hook for updating user profile
export const useUpdateUserInfo = () => {
  const [updateUserProfile, { loading, error, data }] = useMutation(UPDATE_USER_INFO);

  // Define the update function with the expected input
  const update = async ({
    userId,
    firstName,
    lastName,
    email,
    city,
    state,
    country,
    pincode,
  }: {
    userId: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
  }) => {
    try {
      const response = await updateUserProfile({
        variables: {
          userId,
          firstName,
          lastName,
          email,
          city,
          state,
          country,
          pincode,
        },
      });
      console.log(response)

      return response?.data.updateUserInfo || null;
    } catch (err) {
      console.error("Error updating user profile:", err);
      throw new Error("Could not update user profile.");
    }
  };

  return {
    updateUserInfo: update,
    loading,
    error,
    data,
  };
};