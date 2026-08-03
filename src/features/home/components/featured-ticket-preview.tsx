const ticketDetails = [
  {
    label: "Date",
    value: "22 Aug 2026",
  },
  {
    label: "Time",
    value: "6:00 PM",
  },
  {
    label: "Venue",
    value: "Lotus Tower",
  },
];

export function FeaturedTicketPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -right-10 bottom-10 h-40 w-40 rounded-full bg-fuchsia-500/20 blur-3xl" />

      <div className="relative rotate-2 rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl backdrop-blur-xl transition duration-500 hover:rotate-0">
        <div className="overflow-hidden rounded-[1.5rem] bg-white text-gray-950">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-500 px-6 py-8 text-white">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/20 bg-white/10" />
            <div className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-white/20 bg-white/10" />

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <span className="rounded-full border border-white/20 bg-black/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                  Featured Event
                </span>

                <span className="text-xs font-medium text-violet-100">
                  EVT-2026-0822
                </span>
              </div>

              <p className="mt-12 text-sm font-medium text-violet-100">
                Live music experience
              </p>

              <h2 className="mt-2 max-w-xs text-3xl font-bold leading-tight tracking-tight">
                Colombo Music Festival
              </h2>

              <div className="mt-8 grid grid-cols-3 gap-3">
                {ticketDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className="rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-100">
                      {detail.label}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-white">
                      {detail.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative px-6 py-6">
            <div className="absolute -left-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-gray-950" />
            <div className="absolute -right-3 top-0 h-6 w-6 -translate-y-1/2 rounded-full bg-gray-950" />

            <div className="absolute left-5 right-5 top-0 border-t-2 border-dashed border-gray-200" />

            <div className="flex items-center justify-between gap-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                  General admission
                </p>

                <p className="mt-1 text-2xl font-bold">
                  LKR 3,500
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />

                  <span className="text-xs font-medium text-gray-500">
                    Tickets available
                  </span>
                </div>
              </div>

              <QrPreview />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white shadow-xl backdrop-blur-xl sm:block">
        <p className="text-xs font-medium text-gray-300">
          Secure booking
        </p>

        <p className="mt-1 text-sm font-bold">
          Instant QR ticket
        </p>
      </div>
    </div>
  );
}

function QrPreview() {
  return (
    <div
      aria-label="QR ticket preview"
      className="grid h-24 w-24 grid-cols-5 gap-1 rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
    >
      {Array.from({ length: 25 }).map((_, index) => {
        const filledCells = [
          0, 1, 2, 4, 5, 7, 9, 10, 11, 12, 14, 16, 18, 19, 20, 22, 23,
          24,
        ];

        return (
          <span
            key={index}
            className={
              filledCells.includes(index)
                ? "rounded-[2px] bg-gray-950"
                : "rounded-[2px] bg-transparent"
            }
          />
        );
      })}
    </div>
  );
}