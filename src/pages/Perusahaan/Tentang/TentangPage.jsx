import React, { Fragment } from "react";

// components
import { Container } from "@/components";

const TentangPage = () => {
  return (
    <Fragment>
      <div>
        <div className="pb-5 flex items-center justify-center">
          <img
            className="h-56"
            src={"/assets/LogoQNNBlue.svg"}
            alt="LogoQNN"
          />
        </div>
        <Container>
          <h1 className="text-black dark:text-white text-md font-bold text-center my-2 md:text-center md:text-2xl md:my-8">
            Merupakan Perusahaan bergerak dalam jasa penyedia layanan internet,
            backbone, maintenance jaringan internet, Pengembangan Perangkat
            Lunak, Colocation dan IT Consultant.
          </h1>
          <h1 className="text-pink-600 font-bold italic my-4 text-center text-md md:text-3xl md:my-4">
            " Kami Memiliki Komitmen Yang Besar Untuk Maju Dan Berkembang "
          </h1>
          <div className="flex justify-between items-center py-4">
            <div className="flex flex-col py-4 md:pt-0 gap-8">
              <h1 className="text-sm md:text-xl text-black dark:text-white font-bold text-justify mx-4">
                Nilai-Nilai Perusahaan Kami adalah Nilai Nilai Orientasi pada
                Kemitraan. Kami Sangat sadar bahwa Mitra Merupakan Salah satu
                kesatuan yang tidak dapat dipisahkan. Oleh Karena itu kami
                selalu menghargai dan menjaga kepercayaan mitra dalam setiap
                kerja sama yang kami jalani. Hubungan baik antar mitra akan
                selalu kami bina walaupin masa kerja sama telah berakhir.
              </h1>
              <h1 className="text-sm md:text-xl text-black dark:text-white font-bold text-justify mx-4">
                Efektivitas dan Efisiensi solusi Orientasi Kemitraan Memberikan
                Solusi Merupakan tujuan utama dalam setiap jasa yang kami
                berikan. Kami mengkaji dengan seksama setiap masalah yang
                dihadapi guna memberikan solusi yang tepat. Dengan solusi yang
                kami berikan maka mitra akan dengan mudah meminimalisir resiko
                bisnis yang mereka hadapi tanpa mempengaruhi kegiatan usaha itu
                sendiri.
              </h1>
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default TentangPage;
