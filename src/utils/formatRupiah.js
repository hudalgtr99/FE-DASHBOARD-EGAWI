const formatRupiah = (amount, visible = true) => {
  if (!visible) {
    // Jika visible adalah false, kembalikan bintang sebanyak panjang angka
    return "Rp. *****"; // Atau gunakan simbol bintang lain jika ingin.
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
};

export default formatRupiah;
