import ProgressBar from "./ProgressBar";

interface StatusProps {
    nipPenerbitLegalitas?: string;
    statusVerifikator: string;
    idPemetaanKebun: string;
    statusKonfirmator?: string;
    statusCompleted?: number;
}

const StatusProgress: React.FC<StatusProps> = ({
    nipPenerbitLegalitas,
    statusVerifikator,
    idPemetaanKebun,
    statusKonfirmator,
    statusCompleted,
}) => {
    let completed = 20;

    if (nipPenerbitLegalitas !== 'False') {
        completed = 100;
    } else if (
        statusVerifikator !== 'Belum diverifikasi' &&
        idPemetaanKebun !== 'Belum dipetakan' &&
        statusKonfirmator !== 'Belum dikonfirmasi'
    ) {
        completed = 80;
    } else if (idPemetaanKebun !== 'Belum dipetakan') {
        completed = 60;
    } else if (
        statusKonfirmator === 'Disetujui' ||
        statusKonfirmator === 'Ditolak'
    ) {
        completed = 40;
    }
    
    return(
        <>
        { statusCompleted ?(
        <ProgressBar bgcolor="#6a1b9a" completed={statusCompleted} />
        ) :
        (

            <ProgressBar bgcolor="#6a1b9a" completed={completed} />
        )    
    }
        </>
    )
};

export default StatusProgress;