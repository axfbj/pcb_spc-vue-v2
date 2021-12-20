
import FileSaver from 'file-saver'
import { dateformat } from '@/utils/date-method'
export function download_Blob({ data, fileName = `${dateformat(new Date())}.xls` }) {
  FileSaver.saveAs(new Blob([data]), fileName)
}

