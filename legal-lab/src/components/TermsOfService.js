// © 2025 Altangerel Ganbaatar. All rights reserved.
// Licensed under the MIT License. See LICENSE file in the project root for details.

import React from "react";
import { Box, Typography, Container } from "@mui/material";

const TermsOfService = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Typography variant="h4" gutterBottom align="center">
        Үйлчилгээний нөхцөл
      </Typography>
      {/* <Typography variant="subtitle1" align="center" gutterBottom>
        Нэмэлт, өөрчлөлт орсон. 2025.04.30
      </Typography> */}
      <Typography variant="h6" gutterBottom>
        Үйлчилгээний зорилго
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        Судалгааны нэгдсэн систем нь эрх зүйн судалгаа, шинжилгээний
        баримт бичгүүдийг нэг дор төвлөрүүлж,  хэрэглэгчдэд цахим хэлбэрээр
        хүргэхэд оршино.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Нэг. Нийтлэг үндэслэл
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        1.1.Энэхүү нөхцөл нь “Хууль зүйн үндэсний хүрээлэн”-гээс ажиллуулж буй
        Эрх зүйн судалгааны нэгдсэн системийн үйлчилгээ (цаашид “нэгдсэн систем”
        гэх)-г ашиглахтай холбоотой харилцааг зохицуулахад оршино.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        1.2.Нэгдсэн систем нь урьдчилсан мэдэгдэл хийж энэхүү үйлчилгээний
        нөхцөлд нэмэлт, өөрчлөлт оруулах, шинэчлэх эрхтэй.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        1.3.Нэгдсэн системийн үйлчилгээнд ашиглагдаж буй загвар зохиомж болон
        брэндийн шийдлүүд нь “Хууль зүйн үндэсний хүрээлэн”-гийн оюуны өмч
        бөгөөд зөвшөөрөлгүйгээр ямар ч хэлбэрээр ашиглах, хуулбарлах, түгээхийг
        хориглоно.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        1.4.Хууль зүйн үндэсний хүрээлэн нь үйлчилгээний нөхцөлийг зөрчсөн
        хэрэглэгчийн нэгдсэн системд хандах, ашиглах эрхийг түр зогсоох эсвэл
        цуцлах эрхтэй байна.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        1.5.Хэрэглэгч үйлчилгээний нөхцөлтэй танилцан хүлээн зөвшөөрч, нэгдсэн
        системд бүртгүүлсэн өдрөөс эхлэн энэхүү үйлчилгээний нөхцөл нь хүчин
        төгөлдөр үйлчилнэ.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Хоёр. Бодлого, үйл ажиллагаа
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        2.1.Нэгдсэн систем нь судалгааны мэдээллийг хуваалцах, шинжлэх ухаан,
        боловсролыг дэмжих зориулалттай платформ болж ажиллана.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        2.2.Нэгдсэн систем нь үндэсний болон олон улсын түвшний, хууль зүйн
        шинжлэх ухааны судалгааны арга зүйн дагуу бичигдсэн, ач холбогдол бүхий
        бүтээлүүдийг байршуулан нийтэд дамжуулах бодлогыг баримтална.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        2.3.Нэгдсэн систем нь оюуны өмчийг хамгаалан ажиллах бөгөөд нэгдсэн
        системд байгаа бүх материалыг аливаа хэлбэрээр хуулбарлах, түгээх,
        дамжуулах зэрэг үйлдлүүдийг хориглоно.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        2.4.Нэгдсэн систем нь хэрэглэгчийн хувийн мэдээллийг хамгаалах үүднээс
        мэдээллийн аюулгүй байдлыг ханган ажиллана.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        2.5.Нэгдсэн систем нь хэрэглэгчийн хэрэгцээнд нийцүүлэн байнга
        шинэчлэгдэж, хөгжүүлэгдэх бөгөөд тасралтгүй сайжруулалт хийгдэнэ.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Гурав. Нэвтрэх эрхийн бүртгэл
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.1.Нэгдсэн системд нэвтрэхдээ “хэрэглэгч” болон “зохиогч” гэсэн хоёр
        сонголтын нэгийг сонгож бүртгүүлнэ.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.2.Хэрэглэгч нэгдсэн системд бүтээлээ байршуулахын тулд эхлээд
        “Зохиогчоор бүртгүүлэх” гэсэн хэсэгт холбогдох мэдээллийг үнэн зөв
        бөглөн зохиогчоор бүртгүүлнэ.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.3.Хэрэглэгч нэгдсэн системд бүртгүүлснээр нэвтрэх эрхтэй болж
        үйлчилгээ авах эрхтэй болно. Нэг нэвтрэх эрхийг нэг хүн ашиглана.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.4.Хэрэглэгч өөрийн нэвтрэх нэр, нууц үгийн нууцлалыг бүрэн хариуцах
        ба нэвтрэх нэр, нууц үгээ бусдад шилжүүлэх, хэрэглүүлэхгүй байх
        үүрэгтэй.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.5.Хэрэглэгч бүртгүүлсэн мэдээлэл нь өөрчлөгдсөн тохиолдолд тухай бүр
        шинэчилж байх үүрэгтэй бөгөөд энэхүү үүргээ биелүүлээгүйгээс үүсэх
        хариуцлагыг өөрөө хариуцна.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        3.6.Нууц үгээ мартсан тохиолдолд “нууц үг мартсан” гэх цэсэд дарж шинэ
        нууц үг оруулах линктэй холбогдож шинэ нууц үгийг оруулна.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Дөрөв. Бүтээл байршуулах
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        4.1.Нэгдсэн системд зохиогчдын бүтээл байршихаас гадна “Хууль дээдлэх
        ёс” сэтгүүл, судалгааны тайлангийн эмхэтгэл болон бусад бүтээлүүд
        байршина.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        4.2.Хэрэглэгч нь нэгдсэн системд бүтээлээ байршуулахын тулд хянан
        магадалгаа бүхий сэтгүүлд өмнө нь хэвлүүлсэн байх шаардлагатай.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        4.3.Байршуулах бүтээл нь судалгааны арга зүйг ашиглан, онолын болон
        практикийн ач холбогдолтой, бүтээлд тавигдах нийтлэг болон тусгай
        шаардлагыг хангасан, ёс зүйн болон хууль зүйн стандартыг баримтлан
        бичигдсэн байна.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        4.4.Хэрэглэгч нь нэгдсэн системд байршсан бүтээлээ устгах, эсвэл уг
        бүтээлдээ нэмэлт, өөрчлөлт, засвар оруулж дахин илгээх эрхтэй.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        4.5.Хэрэглэгчийн байршуулсан бүтээл нь аливаа хууль зүйн болон ёс зүйн
        зөрчил гаргахгүй байх ёстой бөгөөд гаргасан тохиолдолд үүсэх үр
        дагаврыг хариуцлагыг өөрөө бүрэн хариуцна. Ёс зүйн зөрчил гаргасан
        бүтээлийг нэгдсэн системд байршуулахгүй байх, эсвэл байршсан тохиолдолд
        устгах эрхийг системийн эрх бүхий нэгж хадгална.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Тав. Бүтээл ашиглах
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.1.Хэрэглэгч нь нэгдсэн системд байршуулсан аливаа бүтээл, мэдээллийг
        зөвхөн судалгаа, эрдэм шинжилгээний зорилгоор ашиглах бөгөөд энэхүү
        ашиглалтын хүрээнд тухайн бүтээлийн зохиогч, эх сурвалжийг заавал
        дурдан, холбогдох зүүлт, эшлэлийг ашиглан оюуны өмчийн эрхийг
        зөрчихгүйгээр ашиглах үүрэг хүлээнэ.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.2.Хэрэглэгч нь Нэгдсэн систем дэх аливаа бүтээлээс эшлэл авахдаа
        тухайн бүтээлийн “Эшлэх” товчийг дарж ашиглана. Энэ товчийг дарснаар
        систем дотор эшлэл авалт тоологдож, тухайн бүтээлийн эшлэлт нэмэгдэнэ.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.3.Хэрэглэгч тухайн бүтээлийг хэдэн ч удаа эшлэх боломжтой ба 24 цагт
        1 удаа тоологдоно.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.4.Систем нь бүх бүтээлийн дундаас бүх цаг үеийн хамгийн их эшлэгдсэн
        10 бүтээлийг шалгаруулна.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.5.Эшлэлийн тоогоор тэргүүлж буй 10 бүтээл нь нэгдсэн системийн цахим
        сангийн нүүр хуудасны зүүн хэсэгт байнгын байдлаар харагдана.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        5.6.Энэхүү жагсаалт нь эшлэлийн тоо нэмэгдэх тутам автоматаар
        шинэчлэгдэж, хэрэглэгчдэд хамгийн эрэлттэй бүтээлүүдийг ил тод
        харуулна.
      </Typography>
      <Typography variant="h6" gutterBottom align="center">
        Зургаа. Бусад
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        6.1.Нэгдсэн систем энэхүү үйлчилгээний нөхцөлийг зөрчсөн хэрэглэгчийн
        нэвтрэх эрхийг хаах, эсхүл хязгаарлах, цахим санд байршуулсан
        бүтээгдэхүүнийг устгах арга хэмжээг авах эрхтэй.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        6.2.Хэрэглэгчийн байршуулсан бүтээл нь нэгдсэн системийн үзэл бодол,
        байр суурийг илэрхийлэхгүй бөгөөд нэгдсэн систем нь хэрэглэгчийн үзэл
        бодол, байр суурийн төлөө аливаа хариуцлага хүлээхгүй.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        6.3.Хэрэглэгч нь үйлчилгээний нөхцөлөөр хүлээсэн үүргээ зөрчсөн,
        үйлчилгээг хууль бусаар ашигласан нь батлагдвал Монгол Улсын хууль
        тогтоомжид заасны дагуу хариуцлага хүлээнэ.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        6.4.Энэхүү үйлчилгээний нөхцөлөөр зохицуулагдаагүй бусад асуудлыг
        Монгол Улсын хууль тогтоомжоор зохицуулна.
      </Typography>
      <Typography paragraph style={{ textAlign: "justify" }}>
        6.5.Үйлчилгээтэй холбоотой санал, гомдол, асуудал, маргааныг талууд эв
        зүйгээр харилцан зөвшилцөх замаар шийдвэрлэнэ. Хэрэв шийдвэрлэх
        боломжгүй бол Монгол Улсын хууль, тогтоомжид заасны дагуу
        шийдвэрлүүлнэ.
      </Typography>
    </Container>
  );
};

export default TermsOfService;
