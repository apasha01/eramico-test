import {
  createSlice,
  PayloadAction,
  createAsyncThunk,
  createAction,
} from "@reduxjs/toolkit";
import { logout } from "@/Helpers/LocalStorageHandler/LocalStorageHelper";
import { axiosInstance } from "@/Helpers/axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";

export interface UserInterface {
  // Fields from /api/User/me
  id: number;
  userId: number;
  userName: string;
  firstName: string;
  lastName: string;
  fullName: string;
  accountTypeId: number;
  tenantId: number;
  isActive: boolean;
  avatar: string | null;
  identityImage: string | null;
  phoneNumberConfirmed: boolean;
  email: string;
  emailConfirmed: boolean;
  isAdmin: boolean;
  isChosen: boolean;
  cultureId: number;
  culture: string | null;
  roles: string[];
  accessIds: number[];
  accessTitles: string[];
  birthDate: string;
  gender: boolean | null;
  nationalCode: string | null;
  address: string | null;
  phoneNumber: string;

  // Fields from /api/User/profile
  oldPassword: string | null;
  avatarId: number | null;
  isDisabled: boolean;
  isNew: boolean;
  createdDate: string;
  lastModifiedDate: string;
  title: string | null;
  displayName: string | null;
  telephone: string | null;
  birthdayPlace: string | null;
  isMarried: boolean | null;
  country: string | null;
  province: string | null;
  city: string | null;
  zipCode: string | null;
  fax: string | null;
  shortBiography: string | null;
  biography: string | null;
  verifyStatus: number;
  accountTypeTitle: string;
  cultureTitle: string | null;
  createdDatePersian: string;
  lastModifiedDatePersian: string;
  birthDatePersian: string;
  accountTypeEnTitle: string;
  profilePercentage: number;
  membershipPeriod: string | null;
  followerCount: number;
  followCount: number;
  defaultPositionTitle: string;
  defaultCompanyTitle: string;
  defaultCompanyId: number;
}

interface UserSliceState extends UserInterface {
  loading: "idle" | "pending" | "failed";
  error: string | null;
}

const initialState: UserSliceState = {
  // Fields from /api/User/me
  id: 0,
  userId: 0,
  userName: "",
  firstName: "",
  lastName: "",
  fullName: "",
  accountTypeId: 0,
  tenantId: 0,
  isActive: false,
  avatar: null,
  identityImage: null,
  phoneNumber: "",
  phoneNumberConfirmed: false,
  email: "",
  emailConfirmed: false,
  isAdmin: false,
  isChosen: false,
  cultureId: 0,
  culture: null,
  roles: [],
  accessIds: [],
  accessTitles: [],

  // Fields from /api/User/profile
  oldPassword: null,
  avatarId: null,
  isDisabled: false,
  isNew: false,
  createdDate: "",
  lastModifiedDate: "",
  title: null,
  displayName: null,
  telephone: null,
  birthdayPlace: null,
  isMarried: null,
  country: null,
  province: null,
  city: null,
  zipCode: null,
  fax: null,
  shortBiography: null,
  biography: null,
  verifyStatus: 0,
  accountTypeTitle: "",
  cultureTitle: null,
  createdDatePersian: "",
  lastModifiedDatePersian: "",
  birthDatePersian: "",
  accountTypeEnTitle: "",
  profilePercentage: 0,
  membershipPeriod: null,
  followerCount: 0,
  followCount: 0,
  birthDate: "",
  gender: null,
  nationalCode: null,
  address: null,
  defaultPositionTitle: "",
  defaultCompanyTitle: "",
  defaultCompanyId: 0,

  loading: "idle",
  error: null,
};

// Define the fetchUserMeSuccess action using createAction
export const fetchUserMeSuccess = createAction<any>("user/fetchUserMeSuccess");

export const fetchUserData = createAsyncThunk(
  "user/fetchUserData",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const userMeResponse = await axiosInstance.get("User/me");
      dispatch(fetchUserMeSuccess(userMeResponse?.data));
      const response = await axiosInstance.get("User/profile");
      return response.data;
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        (error.response?.status === 401 || error.response?.status === 403)
      ) {
        logout();
      }
      return rejectWithValue(error || "Error fetching user data");
    }
  }
);

export const updateUserContact = createAsyncThunk(
  "user/updateUserContact",
  async (
    {
      email,
      telephone,
      address,
      phoneNumber,
    }: {
      email: string;
      telephone?: string;
      address?: string;
      phoneNumber?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, string | boolean> = {};
      if (email) params.email = email;
      if (telephone) params.telephone = telephone;
      if (address) params.address = address;
      if (phoneNumber) params.phoneNumber = phoneNumber;

      // Build query string
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();

      const response = await axiosInstance.post<any>(
        `User/update-contact?${queryString}`
      );

      // Assuming the response contains the updated user data
      if (response?.status === 200 && response?.data?.success) {
        toast.success(response?.data?.message);
        return {
          email,
          telephone,
          address,
          phoneNumber,
        };
      } else {
        toast.warning(response?.data?.message);
        return null;
      }
    } catch (error) {
      // Return error to handle it in extra reducers
      return rejectWithValue(error || "Error updating profile");
    }
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (
    {
      firstName,
      lastName,
      userName,
      birthDate,
      gender,
      nationalCode,
      email,
      telephone,
      address,
      phoneNumber,
    }: {
      firstName?: string;
      lastName?: string;
      userName?: string;
      birthDate?: string;
      gender?: boolean;
      nationalCode?: string;
      email?: string;
      telephone?: string;
      address?: string;
      phoneNumber?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params: Record<string, string | boolean> = {};
      if (firstName) params.FirstName = firstName;
      if (lastName) params.LastName = lastName;
      if (userName) params.UserName = userName;
      if (birthDate) params.birthDate = birthDate;
      if (gender !== undefined) params.Gender = gender;
      if (nationalCode) params.NationalCode = nationalCode;
      if (email) params.email = email;
      if (telephone) params.telephone = telephone;
      if (address) params.address = address;
      if (phoneNumber) params.phoneNumber = phoneNumber;

      // Build query string
      const queryString = new URLSearchParams(
        params as Record<string, string>
      ).toString();

      const response = await axiosInstance.post<any>(
        `User/update-profile?${queryString}`
      );

      // Assuming the response contains the updated user data
      if (response?.status === 200 && response?.data?.success) {
        toast.success(response?.data?.message);
        return {
          firstName,
          lastName,
          userName,
          birthDate,
          gender,
          nationalCode,
          email,
          telephone,
          address,
          phoneNumber,
        };
      } else {
        toast.warning(response?.data?.message);
        return null;
      }
    } catch (error) {
      // Return error to handle it in extra reducers
      return rejectWithValue(error || "Error updating profile");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateUser(state, action: PayloadAction<Partial<UserInterface>>) {
      Object.assign(state, action.payload);
    },
    resetUser(state) {
      Object.assign(state, initialState);
      logout();
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchUserMeSuccess (response from /User/me)
      .addCase(fetchUserMeSuccess, (state, action) => {
        const userData = action?.payload?.data || {};
        Object.assign(state, userData);
      })
      .addCase(fetchUserData.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        const profileData = action.payload?.data || {};
        Object.assign(state, profileData);
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        if (action?.payload) {
          Object.assign(state, action.payload);
        }
      })
      .addCase(updateUserContact.pending, (state) => {
        state.loading = "pending";
        state.error = null;
      })
      .addCase(updateUserContact.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.payload as string;
      })
      .addCase(updateUserContact.fulfilled, (state, action) => {
        if (action?.payload) {
          Object.assign(state, action.payload);
        }
      });
  },
});

export const { updateUser, resetUser } = userSlice.actions;

export default userSlice.reducer;
