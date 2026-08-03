const steps = [
  {
    number: "01",
    title: "Discover events",
    description:
      "Browse upcoming concerts, festivals, and live music experiences that match your interests.",
  },
  {
    number: "02",
    title: "Choose your tickets",
    description:
      "Select a ticket type and quantity while viewing transparent pricing and availability.",
  },
  {
    number: "03",
    title: "Pay securely",
    description:
      "Complete your booking through a secure online checkout powered by Stripe.",
  },
  {
    number: "04",
    title: "Access your QR ticket",
    description:
      "Receive a unique digital ticket that you can view from your EventGo account.",
  },
];

export function HowItWorksSection() {
  return (
    <section
        id="how-it-works"
        className="scroll-mt-24 bg-white py-20 sm:py-24"
        >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-600">
            Simple ticket booking
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
            From discovery to entry in four simple steps
          </h2>

          <p className="mt-4 text-base leading-7 text-gray-600">
            EventGo gives attendees a smooth and secure way to find events,
            purchase tickets, and access digital passes.
          </p>
        </div>

        <div className="relative mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent lg:block" />

          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-xl"
            >
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-950 text-sm font-bold text-white shadow-lg transition group-hover:bg-violet-600">
                {step.number}
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight text-gray-950">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}