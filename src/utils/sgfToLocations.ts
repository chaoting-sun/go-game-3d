function sgfToLocations(sgfContent) {
  const locations = [];

  const coordinateMap = "abcdefghijklmnopqrst".split("");

  const moveRegex = /;[BW]\[([a-s]{2})\]/g;
  let match;

  while ((match = moveRegex.exec(sgfContent)) !== null) {
    const [column, row] = match[1].split("");
    const rowi = coordinateMap.indexOf(row);
    const coli = coordinateMap.indexOf(column);
    
    console.log(row, column, ">>", rowi, coli);

    if (rowi !== -1 && coli !== -1) {
      locations.push({ rowi, coli });
    }
  }

  return locations;
}

export default sgfToLocations;
