import React, { useEffect } from "react";
import Layout from "./Layout";
import ProductList from "../components/ProductList";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice.js";

const Products = () => {
  const dispatch = useDispatch(); // digunakan untuk mengirim action ke store redux
  const navigate = useNavigate(); // digunakan untuk mengarahkan pengguna ke halaman yg dituju
  const { isError } = useSelector((state) => state.auth); // digunakan untuk mengakses state Redux. Di sini, kita mengambil "isError" dari state "auth".

  // mengirim action ke getMe ketika component dimounting(pemasangan)
  useEffect(() => {
    dispatch(getMe()); // action mengambil data pengguna untuk melakukan inisialisi
  }, [dispatch]); //Array depedensi yg memastikan berjalan sekali ketika component dimounting

  // mengirim navigasi berdasarkan status kesalahan
  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <div>
      <Layout>
        <ProductList />
      </Layout>
    </div>
  );
};

export default Products;
