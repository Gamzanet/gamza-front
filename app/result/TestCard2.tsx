export async function Comp2(timeHash: string, hooks: string) {
  const cpnt = 2;
  const mode = 2;
  const idx: Array<number> = [0, 1, 4, 5, 6, 7];
  const endpoint = `api/noti/${timeHash}/${hooks}/${mode}/${cpnt}`;

  return (
    <div>
      <p>comp2</p>
      <p>idx: {idx}</p>
      <p>cpnt: {cpnt}</p>
    </div>
  );
}
