export async function Comp1(timeHash: string, hooks: string) {
  const cpnt = 1;
  const mode = 2;
  const idx = 2;
  const endpoint = `api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  return (
    <div>
      <p>comp1</p>
      <p>idx: {idx}</p>
      <p>cpnt: {cpnt}</p>
    </div>
  );
}
