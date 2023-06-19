export const FlavorGroupCard = ({
  label,
  flavors,
}: {
  label?: string;
  flavors?: Array<string>;
}) => (
  <div className="w-full flex justify-center items-center">
    <div className="rounded shadow overflow-hidden py-5 w-full max-w-2xl">
      <h2 className="uppercase text-center text-3xl pb-5">{label}</h2>
      <ul className="grid desktop:grid-cols-2 [&>:nth-child(2n-1)]:bg-primary desktop:[&>:nth-child(2n-1)]:bg-transparent desktop:[&>:nth-child(4n-3)]:bg-primary desktop:[&>:nth-child(4n)]:bg-primary">
        {flavors.map((flavor, index) => (
          <li
            key={index}
            className="text-center px-4 py-2 flex items-center justify-center"
          >
            {flavor}
          </li>
        ))}
      </ul>
    </div>
  </div>
);
