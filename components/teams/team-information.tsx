type TeamInformationProps = {
  name: string;
  shortName: string;
  setName: (value: string) => void;
  setShortName: (value: string) => void;
};

export function TeamInformation({
  name,
  shortName,
  setName,
  setShortName,
}: TeamInformationProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-[#d8e3f0] bg-white">
      <div className="bg-[#eaf3ff] px-5 py-3">
        <h2 className="text-sm font-bold text-[#172b4d]">
          Datos del equipo
        </h2>
      </div>

      <div className="grid gap-5 p-5 md:grid-cols-2">
        <div>
          <label
            htmlFor="teamName"
            className="mb-2 block text-xs font-semibold text-[#172b4d]"
          >
            Nombre del equipo *
          </label>

          <input
            id="teamName"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ej. Barcelona FC"
            minLength={3}
            maxLength={80}
            required
            className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm text-[#172b4d] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label
            htmlFor="shortName"
            className="mb-2 block text-xs font-semibold text-[#172b4d]"
          >
            Sigla del equipo *
          </label>

          <input
            id="shortName"
            value={shortName}
            onChange={(event) =>
              setShortName(event.target.value.toUpperCase())
            }
            placeholder="Ej. FCB"
            minLength={2}
            maxLength={12}
            required
            className="w-full rounded-md border border-[#cbd7e6] px-3 py-2.5 text-sm uppercase text-[#172b4d] outline-none transition focus:border-[#1457c5] focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-[#7184a3]">
            Entre 2 y 12 caracteres.
          </p>
        </div>

        <div>
          <label
            htmlFor="category"
            className="mb-2 block text-xs font-semibold text-[#172b4d]"
          >
            Categoría
          </label>

          <input
            id="category"
            value="Liga Mayor Amateur"
            disabled
            className="w-full rounded-md border border-[#cbd7e6] bg-gray-50 px-3 py-2.5 text-sm text-[#172b4d]"
          />
        </div>
      </div>
    </section>
  );
}
