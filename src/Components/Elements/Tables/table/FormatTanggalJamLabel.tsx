import { HiCheck, HiX } from 'react-icons/hi';
import clsxm from './clsxm';
import moment from 'moment';
import 'moment/locale/id';

moment.locale('id');

type VerificationProps = {
    tanggal: string | any;
    font?: string;
};

export default function FormatTanggalJamLabel({
    tanggal,
    font,
}: VerificationProps) {
    if (tanggal === '0000-00-00 00:00:00' || tanggal === 'False' || !tanggal) {
        tanggal = '0000-00-00 00:00:00';
    } else {
        tanggal = moment(tanggal).format(' HH:mm:ss DD MMMM YYYY ');
    }
    return (
        <span
            className={clsxm(
                `inline-flex items-center gap-1 ${font ? 'font-normal text-sm' : 'font-semibold text-xs'} `,
            )}
        >
            {tanggal}
            <p> </p>
        </span>
    );
}
