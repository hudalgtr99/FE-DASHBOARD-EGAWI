export const convertToRupiah = (value) => {
  // Jika input adalah string, coba konversi ke number
  if (typeof value === "string") {
    // Menghapus karakter non-angka kecuali titik dan koma
    value = value.replace(/[^\d.,]/g, "");

    // Mengganti koma dengan titik jika ada
    value = value.replace(",", ".");

    // Mengubah string menjadi number
    value = parseFloat(value);
  }

  // Memeriksa apakah nilai adalah number dan tidak NaN
  if (typeof value === "number" && !isNaN(value)) {
    return value.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    });
  } else {
    return "Input tidak valid";
  }
};
