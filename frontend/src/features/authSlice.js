import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // adalah fungsi dari Redux Toolkit yang membantu dalam mengatur state dan aksi Redux dengan cara yang lebih efisien.

import axios from "axios"; // import library untuk melakukan req & res sesuai HTTP

// mendefinisikan inisialisai state awal dari slice otentikasi
const initialState = {
  user: null, // menyimpan data pengguna setelah login awalnya kosong(null)
  isError: false, // digunakan untuk mengontrol status permintaan login awalnya kosong
  isSuccess: false, // digunakan untuk mengontrol status permintaan login awalnya kosong
  isLoading: false, // digunakan untuk mengontrol status permintaan login awalnya kosong
  message: "", // untuk menyimpan pesan kesalahan jika ada awalnya kosong
};

// Function Thunks Asinkron untuk login
export const LoginUser = createAsyncThunk(
  "user/LoginUser",
  async (user, thunkAPI) => {
    try {
      // menerima response data post dari sisi backend
      const response = await axios.post("http://localhost:5000/login", {
        email: user.email,
        password: user.password,
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        const message = error.response.data.msg;
        return thunkAPI.rejectWithValue(message);
      }
    }
  }
);

// Function Get Me dari request backend untuk frontend
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5000/me");
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data.msg;
      return thunkAPI.rejectWithValue(message);
    }
  }
});

// Function LogOut
export const LogOut = createAsyncThunk("user/LogOut", async () => {
  await axios.delete("http://localhost:5000/logout");
});

export const authSlice = createSlice({
  name: "auth",
  initialState,
  // mendefinisikan sync yang mengembalikan (state) yg dibungkus ke initialState(ke state awal)
  reducers: {
    reset: (state) => initialState,
  },

  // action ketika user login
  extraReducers: (builder) => {
    // Mengatur isLoading menjadi true saat permintaan dimulai.
    builder.addCase(LoginUser.pending, (state) => {
      state.isLoading = true;
    });

    // Mengatur isLoading menjadi false, isSuccess menjadi true, dan user menjadi payload dari aksi saat permintaan berhasil.
    builder.addCase(LoginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });

    // Mengatur isLoading menjadi false, isError menjadi true, dan message menjadi payload dari aksi saat permintaan gagal.
    builder.addCase(LoginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });

    // Get User Login
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isSuccess = true;
      state.user = action.payload;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.message = action.payload;
    });
  },
});

export const { reset } = authSlice.actions; // reset diekspor untuk mengatur ulang state
export default authSlice.reducer; //  diekspor sebagai default untuk digunakan dalam store Redux.

/*
# Funtion LoginUser
    - createAsyncThunk digunakan untuk membuat thunk asinkron LoginUser.
    - Ini mengirim permintaan POST ke http://localhost:5000/login dengan email dan password pengguna.
    - Jika berhasil, data pengguna dikembalikan.
    - Jika gagal, pesan kesalahan dikembalikan menggunakan thunkAPI.rejectWithValue.

# authSlice 
    - "createSlice" digunakan untuk membuat slice auth.
    - "name" mendefinisikan nama slice.
    - "initialState" adalah state awal yang sudah didefinisikan sebelumnya.
    - "reducers" mendefinisikan fungsi reducer sync (di sini hanya ada satu, reset, yang mengembalikan state ke state awal).
    - "extraReducers" mendefinisikan bagaimana slice menangani aksi yang dibuat oleh createAsyncThunk (LoginUser).
    - "LoginUser.pending": Mengatur isLoading menjadi true saat permintaan dimulai.
    - "LoginUser.fulfilled": Mengatur isLoading menjadi false, isSuccess menjadi true, dan user menjadi payload dari aksi saat permintaan berhasil.
    - "LoginUser.rejected": Mengatur isLoading menjadi false, isError menjadi true, dan message menjadi payload dari aksi saat permintaan gagal

*/
