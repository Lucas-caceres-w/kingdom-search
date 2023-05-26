"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface kingdomData {
  kingdomId: string;
  total: number;
  name: string;
  continent: number;
}

interface EnumKingdom extends Array<kingdomData> {}

export default function Home() {
  const [fecha, setFecha] = useState({
    start: "",
    end: "",
    id: "",
  });
  const [data, setData] = useState<EnumKingdom>();
  const [message, setMessage] = useState("");

  const handleChange = ({
    target: { name, value },
  }: {
    target: { name: string; value: string };
  }) => {
    setFecha((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const ClearSearch = () => {
    setFecha({
      start: "",
      end: "",
      id: "",
    });
    setData([]);
    setMessage("");
  };

  const GetData = async (id: string, startDate: string, endDate: string) => {
    try {
      const res = await fetch(
        `https://api-lok-live.leagueofkingdoms.com/api/stat/land/contribution?landId=${id}&from=${startDate}&to=${endDate}`
      );
      const json = await res.json();
      console.log(json);
      if (json.result === true) {
        setData(json.contribution);
      }
      if (
        json.err.message ===
        "Cast to date failed for value 'Invalid' Date at path 'logDate' for model 'LogLandDev'"
      ) {
        setMessage("Fecha invalida o indefinida");
      }
      if (
        json.err.message ===
        "Cast to number failed for value 'NaN' at path 'landId' for model 'Land'"
      ) {
        setMessage("ID No valido o inexistente");
      }
      if (json.err.code === "under 7 days") {
        setMessage("La fecha no debe ser mayor 7 dias");
      } else {
        setMessage("Ocurrio un error, intentelo de nuevo");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center gap-12 p-6 md:p-12 lg:p-24 lg:pt-4 pt-4 md:pt-4">
      <nav className="w-full flex justify-start">
        <Image
          width={200}
          height={200}
          alt="logo"
          src={"/assets/DRAGON_GAME.png"}
        />
      </nav>
      <section className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          name="id"
          placeholder="Ingrese su id"
          onChange={handleChange}
          value={fecha.id}
          className="border-gradient text-neutral-400 rounded-sm p-2 bg-inherit outline-none"
        />
        <input
          type="date"
          name="start"
          onChange={handleChange}
          value={fecha.start}
          className="border-gradient text-neutral-400 rounded-sm p-2 bg-inherit outline-none"
        />
        <input
          type="date"
          name="end"
          onChange={handleChange}
          value={fecha.end}
          className="border-gradient text-neutral-400 rounded-sm p-2 bg-inherit outline-none"
        />
        <button
          onClick={() => GetData(fecha.id, fecha.start, fecha.end)}
          className="text-white rounded-sm p-2 bg-blue-700 active:bg-blue-800 bg-gradient-to-tr from-fuchsia-600 to-pink-500"
        >
          Buscar
        </button>
        <button
          onClick={() => ClearSearch()}
          className="text-white rounded-sm p-2 bg-blue-700 active:bg-blue-800 bg-gradient-to-r from-fuchsia-600 to-pink-500"
        >
          Limpiar busqueda
        </button>
      </section>
      <div className="w-full">
        <table className="w-full xl:w-10/12 m-auto">
          <thead className="text-zinc-200">
            <th className="p-4 xl:p-10 text-left border-y border-neutral-500 w-48">
              Kingdom ID
            </th>
            <th className="p-4 xl:p-10 text-left border-y border-neutral-500 w-48">
              Total
            </th>
            <th className="p-4 xl:p-10 text-left border-y border-neutral-500 w-48">
              Name
            </th>
            <th className="p-4 xl:p-10 text-left border-y border-neutral-500 w-48">
              Continent
            </th>
          </thead>
          <tbody>
            {data ? (
              data.length > 0 &&
              data.map((e, index) => {
                return (
                  <tr key={index}>
                    <td className="p-4 xl:p-10 w-full xl:w-48  border-y border-neutral-500 text-left text-xs sm:text-sm">
                      {e.kingdomId}
                    </td>
                    <td className="p-4 xl:p-10 w-full xl:w-48  border-y border-neutral-500 text-left text-xs sm:text-sm">
                      {e.total}
                    </td>
                    <td className="p-4 xl:p-10 w-full xl:w-48  border-y border-neutral-500 text-left text-xs sm:text-sm">
                      {e.name}
                    </td>
                    <td className="p-4 xl:p-10 w-full xl:w-48  border-y border-neutral-500 text-left text-xs sm:text-sm">
                      {e.continent}
                    </td>
                  </tr>
                );
              })
            ) : (
              <th colSpan={4} className="text-center p-10 m-auto text-red-500">
                {message ? message : "Sin resultados"}
              </th>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
