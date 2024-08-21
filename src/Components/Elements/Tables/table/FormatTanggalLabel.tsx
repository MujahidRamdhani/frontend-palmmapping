import { HiCheck, HiX } from 'react-icons/hi';

import clsxm from './clsxm';
import moment from 'moment';
type VerificationProps = {
    tanggal: string;
};

export default function FormatTanggalLabel({ tanggal }: VerificationProps) {
    return (
        <span
            className={clsxm(
                'inline-flex items-center gap-1 rounded-md border py-1 px-2 text-xs font-semibold',
            )}
        >
            <p>Contoh 6 : {moment(tanggal).format('YY:MM:DD:H:S')}</p>
        </span>
    );
}
