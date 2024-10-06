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
mutation UpdateProfileImage($userId: ID!, $profileImage: String) {
  updateProfileImage(userId: $userId, profileImage: $profileImage) {
    status
    message
  }
}
`

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
  
  const update = async ({ userId, profileImage }: { userId: string; profileImage: string | null }) => {
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
