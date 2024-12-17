import TemplateAkun from "./TemplateAkunPage";
import {
  API_URL_getdataakun,
} from "@/constants";

export default function AkunAktifPage(){
  return <TemplateAkun getapiakun={API_URL_getdataakun} aktif={true} />
}