import React from 'react';
import FormatTanggalJamLabel from '../Tables/table/FormatTanggalJamLabel';

type T = {
    keterangan?: string;
    nama?: string;
    span?: string;
    tanggal?: string;
};

const TextKeterangan: React.FC<T> = ({ keterangan, nama, span, tanggal }) => {
    return (
        <div className="flex">
            <h4 className="text-sm  md:w-[40%]   lg:w-[34%] 2xl:w-[24%]">
                {nama}
            </h4>
            <div className="text-sm w-[40%]">
                :
                {tanggal ? (
                    <>
                        &nbsp;{' '}
                        <FormatTanggalJamLabel tanggal={tanggal} font="base" />
                    </>
                ) : (
                    <>
                        {' '}
                        &nbsp;{keterangan} {span && <span>{span}</span>}
                    </>
                )}
            </div>
        </div>
    );
};

export default TextKeterangan;
