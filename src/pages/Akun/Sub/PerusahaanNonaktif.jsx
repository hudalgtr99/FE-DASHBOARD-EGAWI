import TemplateAkun from "./TemplateAkunPage";
import {
  API_URL_getdataakunnonaktif,
} from "@/constants";

export default function AkunNonaktifAktifPage(){
  return <TemplateAkun getapiakun={API_URL_getdataakunnonaktif} activeTab="1" />
}